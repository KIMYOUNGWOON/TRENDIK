import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { DocumentData } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface Props {
  feed: DocumentData;
}

const SearchFeedListItem: React.FC<Props> = React.memo(({ feed }) => {
  const navigate = useNavigate();
  return (
    <Container
      key={feed.id}
      $feedImage={feed.feedImages[0]}
      onClick={() => {
        navigate(`/feeds/${feed.id}`);
        window.scrollTo(0, 0);
      }}
    >
      {feed.feedImages.length > 1 && <CopyIcon icon={faClone} />}
      <Background>
        <ViewText>VIEW</ViewText>
      </Background>
    </Container>
  );
});

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.4);
  opacity: 0;
  transition: 0.4s;
`;

const ViewText = styled.div`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #fff;
  color: #fff;
  font-size: 12px;
`;

const Container = styled.li<{ $feedImage: string }>`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-image: url(${({ $feedImage }) => $feedImage});
  background-position: center;
  background-size: cover;
  transition: 0.4s;
  &:hover {
    cursor: pointer;
    transform: scale(0.95);
    & > ${Background} {
      opacity: 1;
    }
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 16px;
`;

export default SearchFeedListItem;
