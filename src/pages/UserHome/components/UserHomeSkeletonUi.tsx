import styled from "styled-components";

function UserHomeSkeletonUi() {
  return (
    <Container>
      <ProfileInfoWrapper>
        <ProfileImage />
        <NickName />
        <BodyInfo />
        <Name />
        <ButtonWrapper>
          <AuthButton />
          <FollowButton />
          <MessageButton />
        </ButtonWrapper>
      </ProfileInfoWrapper>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  height: 460px;
  margin-bottom: 20px;
  padding: 30px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const ProfileInfoWrapper = styled.div`
  position: absolute;
  bottom: 40px;
`;

const ProfileImage = styled.div`
  width: 74px;
  height: 74px;
  border-radius: 50%;
  background-color: rgba(1, 1, 1, 0.1);
  margin-bottom: 12px;
`;

const NickName = styled.div`
  width: 140px;
  height: 22px;
  margin-bottom: 18px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const BodyInfo = styled.div`
  width: 200px;
  height: 14px;
  margin-bottom: 16px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const Name = styled.div`
  width: 90px;
  height: 16px;
  margin-bottom: 20px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const AuthButton = styled.div`
  width: 90px;
  height: 38px;
  border-radius: 8px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const FollowButton = styled(AuthButton)``;

const MessageButton = styled(AuthButton)``;

export default UserHomeSkeletonUi;
