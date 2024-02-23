import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../api/userApi";
import {
  checkFollowStatus,
  getFollowers,
  getFollowings,
  toggleFollow,
} from "../../api/connectApi";
import { useContext, useRef } from "react";
import UserContext from "../../contexts/UserContext";
import FeedList from "./components/FeedList";
import { getUserFeeds } from "../../api/postApi";
import { useDebouncedMutation } from "../../hooks/useDebouncedMutation";
import UserHomeSkeletonUi from "./components/UserHomeSkeletonUi";

function UserHome() {
  const { authUserId } = useContext(UserContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const myPage = authUserId === userId;
  const previousStatus = useRef<boolean>();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (userId) {
        return getUser(userId);
      }
    },
    enabled: !!userId,
  });

  const { data: feeds, isLoading: feedsLoading } = useQuery({
    queryKey: ["feeds", userId],
    queryFn: () => getUserFeeds(userId),
    enabled: !!userId,
  });

  const { data: followers, isLoading: followerLoading } = useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => await getFollowers(userId),
    enabled: !!userId,
  });

  const { data: followings, isLoading: followingLoading } = useQuery({
    queryKey: ["followings", userId],
    queryFn: async () => await getFollowings(userId, "basics"),
    enabled: !!userId,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", userId],
    queryFn: async () => await checkFollowStatus(userId),
    enabled: !myPage,
  });

  const toggleFollowMutation = useDebouncedMutation(
    async (action: string) => toggleFollow(action, userId),
    {
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["followStatus", userId],
        });

        return { previousStatus: previousStatus.current };
      },
      onError: (
        error: Error,
        variables: string,
        context: {
          previousStatus: boolean;
        }
      ) => {
        console.error(`An error occurred while ${variables}: ${error.message}`);
        if (context) {
          queryClient.setQueryData(
            ["followStatus", userId],
            context.previousStatus
          );
        }
      },
    }
  );

  function handleToggleFollow() {
    const currentStatus = queryClient.getQueryData<boolean>([
      "followStatus",
      userId,
    ]);

    previousStatus.current = currentStatus;

    queryClient.setQueryData(["followStatus", userId], !currentStatus);

    toggleFollowMutation.mutate(!currentStatus ? "follow" : "unFollow");
  }

  const userHomeLoading =
    userLoading || feedsLoading || followerLoading || followingLoading;

  return (
    <Container>
      <ContentBox>
        {userHomeLoading ? (
          <UserHomeSkeletonUi />
        ) : (
          <ProfileBox $visible={user?.coverImage}>
            <Background>
              <ProfileInfoWrapper>
                <ProfileImageWrapper>
                  {user?.profileImage ? (
                    <ProfileImage $profileImage={user?.profileImage} />
                  ) : (
                    <ProfileIcon icon={faCircleUser} />
                  )}
                </ProfileImageWrapper>
                <NickName>{user?.nickName}</NickName>
                <BodyInfo>
                  {user?.gender === "남성" ? "MAN" : "WOMAN"} • {user?.height}cm
                  • {user?.weight}kg • {user?.shoesSize}mm
                </BodyInfo>
                <Name>{user?.name}</Name>
                <ButtonWrapper>
                  {myPage && (
                    <EditBtn
                      onClick={() => {
                        navigate("/profile-edit");
                      }}
                    >
                      <EditIcon icon={faPenToSquare} />
                      <EditText>프로필 설정</EditText>
                    </EditBtn>
                  )}
                  {!myPage &&
                    (followStatus ? (
                      <UnFollowBtn onClick={handleToggleFollow}>
                        <UnFollowIcon icon={faCircleCheck} />
                        <UnFollowText>팔로잉</UnFollowText>
                      </UnFollowBtn>
                    ) : (
                      <FollowBtn onClick={handleToggleFollow}>
                        <FollowIcon icon={faCirclePlus} />
                        <FollowText>팔로우</FollowText>
                      </FollowBtn>
                    ))}
                  {!myPage && (
                    <MessageBtn
                      onClick={() => {
                        navigate(`/direct/${userId}`);
                      }}
                    >
                      <MessageIcon icon={faEnvelope} />
                      <MessageText>메세지</MessageText>
                    </MessageBtn>
                  )}
                </ButtonWrapper>
              </ProfileInfoWrapper>
            </Background>
          </ProfileBox>
        )}
        <CountBox>
          <CountWrapper>
            {userHomeLoading ? (
              <SpinnerIcon icon={faSpinner} spinPulse />
            ) : (
              <CountNumber>{feeds?.length}</CountNumber>
            )}
            <CountTitle>게시물</CountTitle>
          </CountWrapper>
          <CountWrapper
            onClick={() => {
              navigate(`/users/${userId}/follower`);
            }}
          >
            {userHomeLoading ? (
              <SpinnerIcon icon={faSpinner} spinPulse />
            ) : (
              <CountNumber>{followers?.length}</CountNumber>
            )}
            <CountTitle>팔로워</CountTitle>
          </CountWrapper>
          <CountWrapper
            onClick={() => {
              navigate(`/users/${userId}/following`);
            }}
          >
            {userHomeLoading ? (
              <SpinnerIcon icon={faSpinner} spinPulse />
            ) : (
              <CountNumber>{followings?.length}</CountNumber>
            )}
            <CountTitle>팔로잉</CountTitle>
          </CountWrapper>
        </CountBox>
        <FeedList feeds={feeds} userHomeLoading={userHomeLoading} />
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding-top: 40px;
  padding-bottom: 71px;
  background-color: #fff;
`;

const ProfileBox = styled.div<{ $visible: string }>`
  position: relative;
  height: 460px;
  margin-bottom: 20px;
  background-color: rgba(1, 1, 1, 0.4);
  background-image: ${({ $visible }) => ($visible ? `url(${$visible})` : "")};
  background-position: center;
  background-size: cover;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  padding: 30px;
  background-color: rgba(1, 1, 1, 0.4);
`;

const ProfileInfoWrapper = styled.div`
  position: absolute;
  bottom: 40px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
  border-radius: 50%;
  background-color: #fff;
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-size: cover;
  background-position: center;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.2);
  font-size: 74px;
`;

const NickName = styled.div`
  color: #fff;
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 20px;
`;

const BodyInfo = styled.div`
  margin-bottom: 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1px;
`;

const Name = styled.div`
  margin-bottom: 20px;
  color: #fff;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const FollowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 14px;
  border-radius: 8px;
  background-color: #1375ff;
  color: #fff;
  font-size: 12px;

  &:hover {
    cursor: pointer;
  }
`;

const FollowText = styled.div``;

const FollowIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const UnFollowBtn = styled(FollowBtn)`
  background-color: #94c0fd;
`;

const UnFollowText = styled.div``;

const UnFollowIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const MessageBtn = styled(FollowBtn)``;

const MessageText = styled.div``;

const MessageIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const EditBtn = styled(FollowBtn)``;

const EditText = styled.div``;

const EditIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const CountBox = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0 34px 24px;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
`;

const CountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;

  &:hover {
    cursor: pointer;
  }
`;

const CountTitle = styled.div`
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
`;

const CountNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.8);
  font-size: 20px;
`;

export default UserHome;
