import styled from "styled-components";

function MenuSkeletonUi() {
  return (
    <Container>
      <ProfileImage />
      <Nickname />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(1, 1, 1, 0.1);
`;

const Nickname = styled.div`
  width: 100px;
  height: 18px;
  background-color: rgba(1, 1, 1, 0.1);
`;

export default MenuSkeletonUi;
