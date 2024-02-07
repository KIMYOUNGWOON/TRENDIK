import { DocumentData } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-regular-svg-icons";

interface Props {
  feeds: DocumentData[] | undefined;
}

const FeedList: React.FC<Props> = ({ feeds }) => {
  const navigate = useNavigate();

  if (!feeds) {
    return;
  }

  return (
    <Container>
      {feeds.map((feed) => {
        return (
          <FeedListItem
            key={feed.id}
            $imageUrl={feed.feedImages[0]}
            onClick={() => {
              navigate(`/feeds/${feed.id}`);
              window.scrollTo(0, 0);
            }}
          >
            {feed.feedImages.length > 1 && <CopyIcon icon={faClone} />}
          </FeedListItem>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
`;

const FeedListItem = styled.div<{ $imageUrl: string }>`
  position: relative;
  width: 100%;
  height: 165px;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-size: cover;
  background-position: center;

  &:hover {
    cursor: pointer;
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 18px;
`;

export default FeedList;
