import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../api/userApi";
import {
  checkFollowStatus,
  follow,
  getFollowers,
  getFollowings,
  unFollow,
} from "../../api/connectApi";
import { useContext } from "react";
import UserContext from "../../contexts/UserContext";

function UserHome() {
  const { authUser } = useContext(UserContext);
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const myPage = authUser.userId === userId;

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      return getUser(userId);
    },
    enabled: !!userId,
  });

  const { data: followers } = useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => await getFollowers(userId),
    enabled: !!userId,
  });

  const { data: followings } = useQuery({
    queryKey: ["followings", userId],
    queryFn: async () => await getFollowings(userId),
    enabled: !!userId,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["followStatus", userId],
    queryFn: async () => await checkFollowStatus(userId),
  });

  const updateFollowStatus = (newStatus: boolean | undefined) => {
    queryClient.setQueryData(["followStatus", userId], newStatus);
  };

  const followMutation = useMutation({
    mutationFn: async () => follow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", userId],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        "followStatus",
        userId,
      ]);

      updateFollowStatus(true);

      return { previousStatus };
    },
    onError: (error, variables, context) => {
      if (context) {
        updateFollowStatus(context.previousStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", userId],
      });
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: async () => unFollow(userId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", userId],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        "followStatus",
        userId,
      ]);

      updateFollowStatus(false);

      return { previousStatus };
    },
    onError: (error, variables, context) => {
      if (context) {
        updateFollowStatus(context.previousStatus);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["followStatus", userId],
      });
    },
  });

  function handleFollow() {
    followMutation.mutate();
  }

  function handleUnFollow() {
    unFollowMutation.mutate();
  }

  return (
    <Container>
      <ContentBox>
        <ProfileBox $isExist={user?.coverImage}>
          <Background>
            <IconWrapper>
              <BackIcon
                icon={faChevronLeft}
                onClick={() => {
                  navigate(-1);
                }}
              />
              <ListIcon icon={faEllipsisVertical} />
            </IconWrapper>
            <ProfileInfoWrapper>
              <ProfileImageWrapper>
                {user?.profileImage ? (
                  <ProfileImage src={user?.profileImage} />
                ) : (
                  <ProfileIcon icon={faCircleUser} />
                )}
              </ProfileImageWrapper>
              <NickName>{user?.nickName}</NickName>
              <ButtonWrapper>
                {myPage && (
                  <EditBtn
                    onClick={() => {
                      navigate("/profile-edit");
                    }}
                  >
                    <EditText>프로필 설정</EditText>
                    <EditIcon icon={faPenToSquare} />
                  </EditBtn>
                )}
                {!myPage &&
                  (followStatus ? (
                    <UnFollowBtn onClick={handleUnFollow}>
                      <UnFollowText>팔로잉</UnFollowText>
                      <UnFollowIcon icon={faCircleCheck} />
                    </UnFollowBtn>
                  ) : (
                    <FollowBtn onClick={handleFollow}>
                      <FollowText>팔로우</FollowText>
                      <FollowIcon icon={faCirclePlus} />
                    </FollowBtn>
                  ))}
                {!myPage && (
                  <MessageBtn>
                    <MessageText>메세지</MessageText>
                    <MessageIcon icon={faEnvelope} />
                  </MessageBtn>
                )}
              </ButtonWrapper>
            </ProfileInfoWrapper>
          </Background>
        </ProfileBox>
        <CountBox>
          <CountWrapper>
            <CountNumber>0</CountNumber>
            <CountTitle>게시물</CountTitle>
          </CountWrapper>
          <CountWrapper
            onClick={() => {
              navigate(`/users/${userId}/follower`);
            }}
          >
            <CountNumber>{followers?.length}</CountNumber>
            <CountTitle>팔로워</CountTitle>
          </CountWrapper>
          <CountWrapper
            onClick={() => {
              navigate(`/users/${userId}/following`);
            }}
          >
            <CountNumber>{followings?.length}</CountNumber>
            <CountTitle>팔로잉</CountTitle>
          </CountWrapper>
        </CountBox>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding-top: 40px;
  background-color: #fff;
`;

const ProfileBox = styled.div<{ $isExist: string }>`
  position: relative;
  height: 460px;
  margin-bottom: 20px;
  background-color: rgba(1, 1, 1, 0.4);
  background-image: ${({ $isExist }) => ($isExist ? `url(${$isExist})` : "")};
  background-position: center;
  background-size: cover;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  padding: 30px;
  background-color: rgba(1, 1, 1, 0.4);
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 150px;
`;

const BackIcon = styled(FontAwesomeIcon)`
  font-size: 28px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const ListIcon = styled(FontAwesomeIcon)`
  font-size: 28px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const ProfileInfoWrapper = styled.div``;

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

const ProfileImage = styled.img`
  width: 74px;
  height: 74px;
  border-radius: 50%;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.2);
  font-size: 74px;
`;

const NickName = styled.div`
  margin-bottom: 30px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
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
  padding: 0 12px;
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

export default UserHome;
