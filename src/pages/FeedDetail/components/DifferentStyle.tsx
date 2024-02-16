import { useQuery } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import { getDifferentPost } from "../../../api/postApi";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";

interface Props {
  feedData: DocumentData;
}

const DifferentPost: React.FC<Props> = ({ feedData }) => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["differentFeeds", feedData.id],
    queryFn: () => getDifferentPost(feedData.userInfo.userId, feedData.id),
  });

  if (!data || data.length === 0) {
    return;
  }

  return (
    <Container>
      <Title>
        {feedData.userInfo.nickName}
        <Span>님의 다른 게시물</Span>
      </Title>
      <Swiper spaceBetween={2} slidesPerView={3}>
        {data.map((feed) => {
          return (
            <SwiperSlide key={feed.id}>
              <FeedListItem
                $feedImage={feed.feedImages[0]}
                onClick={() => {
                  navigate(`/feeds/${feed.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                {feed.feedImages.length > 1 && <CopyIcon icon={faClone} />}
              </FeedListItem>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Container>
  );
};

const Container = styled.div`
  padding: 0 20px;
  margin-bottom: 40px;
`;

const Title = styled.div`
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 600;
`;

const Span = styled.span`
  color: rgba(1, 1, 1, 0.5);
  font-weight: 400;
`;

const FeedListItem = styled.div<{ $feedImage: string }>`
  position: relative;
  width: 100%;
  height: 160px;
  background-image: url(${({ $feedImage }) => $feedImage});
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
  font-size: 16px;
`;

export default DifferentPost;
