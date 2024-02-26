import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import { getSimilarPost } from "../../../api/postApi";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";

interface Props {
  feedData: DocumentData;
}

const SimilarStyle: React.FC<Props> = ({ feedData }) => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ["similarFeeds", feedData.id],
    queryFn: () => getSimilarPost(feedData.userInfo.userId, feedData.style),
  });

  if (!data || data.length === 0) {
    return;
  }

  return (
    <Container>
      <Title>
        다른 사용자<Span>의 유사한 스타일 게시물</Span>
      </Title>
      <FeedList>
        {data.map((feed) => {
          return (
            <FeedListItem
              key={feed.id}
              $feedImage={feed.feedImages[0]}
              onClick={() => {
                navigate(`/feeds/${feed.id}`);
                window.scrollTo(0, 0);
              }}
            >
              {feed.feedImages.length > 1 && <CopyIcon icon={faClone} />}
            </FeedListItem>
          );
        })}
      </FeedList>
    </Container>
  );
};

const Container = styled.div``;

const Title = styled.div`
  padding: 0 20px;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
`;

const Span = styled.span`
  color: rgba(1, 1, 1, 0.5);
  font-weight: 400;
`;

const FeedList = styled.ul`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

const FeedListItem = styled.li<{ $feedImage: string }>`
  position: relative;
  color: rgba(1, 1, 1, 0.5);
  font-weight: 400;
  width: 100%;
  height: 150px;
  background-image: url(${({ $feedImage }) => $feedImage});
  background-position: center;
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 16px;
`;

export default SimilarStyle;
