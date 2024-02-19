import styled from "styled-components";

const UserListSkeletonUi = () => {
  return (
    <Container>
      <ProfileWrapper>
        <ProfileImage />
        <NickName />
      </ProfileWrapper>
      <Button />
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

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(1, 1, 1, 0.1);
`;

const NickName = styled.div`
  width: 100px;
  height: 20px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const Button = styled.div`
  width: 92px;
  height: 40px;
  border-radius: 8px;
  background-color: rgba(1, 1, 1, 0.1);
`;

export default UserListSkeletonUi;
