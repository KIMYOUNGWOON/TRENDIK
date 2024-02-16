import styled from "styled-components";

function FeedDetailSkeletonUi() {
  return (
    <Container>
      <FeedHeader>
        <ProfileWrapper>
          <ProfileImage />
          <Wrapper>
            <NickName />
            <BodyInfo />
          </Wrapper>
        </ProfileWrapper>
      </FeedHeader>
      <FeedImage />
    </Container>
  );
}

const Container = styled.div`
  padding: 130px 0;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 20px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ProfileImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(1, 1, 1, 0.1);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NickName = styled.div`
  width: 90px;
  height: 18px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const BodyInfo = styled.div`
  width: 180px;
  height: 14px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const FeedImage = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background-color: rgba(1, 1, 1, 0.1);
`;

export default FeedDetailSkeletonUi;
