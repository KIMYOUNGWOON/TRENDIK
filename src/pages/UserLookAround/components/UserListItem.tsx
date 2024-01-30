import styled from "styled-components";
import { UserType } from "../../../api/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface Props {
  user: UserType;
}

const UserListItem: React.FC<Props> = ({ user }) => {
  const navigate = useNavigate();

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
      <FollowBtn>+ 팔로우</FollowBtn>
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
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.2);
  font-size: 60px;
`;

const NickName = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const FollowBtn = styled.div`
  background-color: #1375ff;
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
`;

export default UserListItem;
