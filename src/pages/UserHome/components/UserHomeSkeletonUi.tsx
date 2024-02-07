import styled from "styled-components";

const feedList = Array(9).fill(0);

function UserHomeSkeletonUi() {
  return (
    <Container>
      {feedList.map((_, index) => {
        return <FeedListItem key={index} />;
      })}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
`;

const FeedListItem = styled.div`
  position: relative;
  width: 100%;
  height: 165px;
  background-color: rgba(1, 1, 1, 0.1);
`;

export default UserHomeSkeletonUi;
