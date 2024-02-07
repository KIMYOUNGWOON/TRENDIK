import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkFollowStatus, follow, unFollow } from "../../../api/connectApi";
import SkeletonUi from "./SkeletonUi";
import { DocumentData } from "firebase/firestore";

interface Props {
  user: DocumentData;
  usersLoading?: boolean;
  authUserId?: string;
}

const UserListItem: React.FC<Props> = ({ user, usersLoading, authUserId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading: followStatusLoading } = useQuery({
    queryKey: ["followStatus", user.userId],
    queryFn: async () => await checkFollowStatus(user.userId),
  });

  const updateFollowStatus = (newStatus: boolean | undefined) => {
    queryClient.setQueryData(["followStatus", user.userId], newStatus);
  };

  const followMutation = useMutation({
    mutationFn: async () => follow(user.userId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", user.userId],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        "followStatus",
        user.userId,
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
        queryKey: ["followStatus", user.userId],
      });
    },
  });

  const unFollowMutation = useMutation({
    mutationFn: async () => unFollow(user.userId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["followStatus", user.userId],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        "followStatus",
        user.userId,
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
        queryKey: ["followStatus", user.userId],
      });
    },
  });

  function handleFollow() {
    followMutation.mutate();
  }

  function handleUnFollow() {
    unFollowMutation.mutate();
  }

  if (followStatusLoading || usersLoading || authUserId === "") {
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
          <ProfileImage src={user.profileImage} />
        ) : (
          <ProfileIcon icon={faCircleUser} />
        )}
        <NickName>{user.nickName}</NickName>
      </ProfileWrapper>
      {authUserId !== user.userId &&
        (data ? (
          <UnFollowBtn onClick={handleUnFollow}>
            <UnFollowIcon icon={faCircleCheck} />
            <UnFollowText>팔로잉</UnFollowText>
          </UnFollowBtn>
        ) : (
          <FollowBtn onClick={handleFollow}>
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

const ProfileImage = styled.img`
  width: 58px;
  height: 58px;
  border-radius: 50%;
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
