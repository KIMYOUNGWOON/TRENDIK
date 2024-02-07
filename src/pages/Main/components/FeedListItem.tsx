import { DocumentData } from "firebase/firestore";
import Slider from "react-slick";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getLikeStatus } from "../../../api/likeAti";

interface Props {
  authUserId: string;
  feed: DocumentData;
}

const FeedListItem: React.FC<Props> = ({ feed, authUserId }) => {
  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${feed.id}`],
    queryFn: () => getLikeStatus(feed.id),
  });

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
  };
  return (
    <Container>
      <FeedHeader>
        <ProfileWrapper>
          <ProfileImage $profileImage={feed.userInfo.profileImage} />
          <NickName>{feed.userInfo.nickName}</NickName>
        </ProfileWrapper>
        {likeStatus ? (
          <HeartIcon icon={faSolidHeart} />
        ) : (
          <HeartIcon icon={faHeart} />
        )}
      </FeedHeader>
      {feed.feedImages.length > 1 ? (
        <Slider {...settings}>
          {feed.feedImages.map((img: string, index: number) => {
            return (
              <FeedImage key={index} $imageUrl={img}>
                <CopyIcon icon={faClone} />
              </FeedImage>
            );
          })}
        </Slider>
      ) : (
        <FeedImage $imageUrl={feed.feedImages[0]} />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 235px;
`;

const FeedHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-size: cover;
  background-position: center;
`;

const NickName = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: rgba(1, 1, 1, 0.8);

  &:hover {
    cursor: pointer;
  }
`;

const FeedImage = styled.div<{ $imageUrl: string }>`
  position: relative;
  width: 100%;
  height: 250px;
  border-radius: 8px;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-position: center;
  background-size: cover;
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 16px;
  right: 16px;
  color: #fff;
  font-size: 22px;
`;

export default FeedListItem;
