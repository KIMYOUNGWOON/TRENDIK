import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkFollowStatus, toggleFollow } from "../../../api/connectApi";
import SkeletonUi from "./SkeletonUi";
import { DocumentData } from "firebase/firestore";
import { useRef } from "react";
import { useDebouncedMutation } from "../../../hooks/useDebouncedMutation";

interface Props {
  user: DocumentData;
  usersLoading?: boolean;
  authUserId?: string;
}

const UserListItem: React.FC<Props> = ({ user, usersLoading, authUserId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const previousStatus = useRef<boolean>();

  const { data, isLoading: followStatusLoading } = useQuery({
    queryKey: ["followStatus", user.userId],
    queryFn: async () => await checkFollowStatus(user.userId),
  });

  const toggleFollowMutation = useDebouncedMutation(
    async (action: string) => toggleFollow(action, user.userId),
    {
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: ["followStatus", user.userId],
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
        if (context) {
          queryClient.setQueryData(
            ["followStatus", user.userId],
            context.previousStatus
          );
        }
      },
    }
  );

  function handleToggleFollow() {
    const currentStatus = queryClient.getQueryData<boolean>([
      "followStatus",
      user.userId,
    ]);

    previousStatus.current = currentStatus;

    queryClient.setQueryData(["followStatus", user.userId], !currentStatus);

    toggleFollowMutation.mutate(!currentStatus ? "follow" : "unFollow");
  }

  if (followStatusLoading || usersLoading) {
    return <SkeletonUi />;
  }

  return (
    <Container>
      <ProfileWrapper
        onClick={() => {
          navigate(`/users/${user.userId}`);
        }}
      >
        {user.profileImage ? (
          <ProfileImage $profileImage={user.profileImage} />
        ) : (
          <ProfileIcon icon={faCircleUser} />
        )}
        <NickName>{user.nickName}</NickName>
      </ProfileWrapper>
      {authUserId !== user.userId &&
        (data ? (
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  &:hover {
    cursor: pointer;
  }
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-size: cover;
  background-position: center;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.1);
  font-size: 58px;
`;

const NickName = styled.div`
  font-weight: 500;
`;

const FollowBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 94px;
  height: 36px;
  border-radius: 8px;
  background-color: #1375ff;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const FollowText = styled.div`
  padding-bottom: 2px;
  font-size: 14px;
`;

const FollowIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

const UnFollowBtn = styled(FollowBtn)`
  background-color: #bfd8ff;
`;

const UnFollowText = styled.div`
  padding-bottom: 2px;
  font-size: 14px;
`;

const UnFollowIcon = styled(FontAwesomeIcon)`
  font-size: 16px;
`;

export default UserListItem;
