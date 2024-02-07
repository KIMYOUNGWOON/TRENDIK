import styled from "styled-components";

function MainSkeletonUi() {
  const feedList = Array(6).fill(0);
  return (
    <Container>
      <FeedList>
        {feedList.map((_, index) => {
          return (
            <FeedListItem key={index}>
              <FeedHeader>
                <ProfileImage />
                <NickName />
              </FeedHeader>
              <FeedImage />
            </FeedListItem>
          );
        })}
      </FeedList>
    </Container>
  );
}

const Container = styled.div`
  padding: 100px 10px;
`;

const FeedList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const FeedListItem = styled.li``;

const FeedHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const ProfileImage = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(1, 1, 1, 0.1);
`;

const NickName = styled.div`
  width: 90px;
  height: 14px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const FeedImage = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 8px;
  background-color: rgba(1, 1, 1, 0.1);
`;

export default MainSkeletonUi;
