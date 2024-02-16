import styled from "styled-components";
import { scaleUp } from "../../styles/Animation";
import Header from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFeed } from "../../api/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faSolidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import FeedDetailSkeletonUi from "./components/FeedDetailSkeletonUi";
import { useContext, useRef, useState } from "react";
import FeedSetUpModal from "./components/FeedSetUpModal";
import { getLikeStatus, toggleLikeFeed } from "../../api/likeApi";
import UserContext from "../../contexts/UserContext";
import CommentModal from "./components/CommentModal";
import { useDebouncedMutation } from "../../hooks/useDebouncedMutation";
import { DocumentData } from "firebase/firestore";
import HashTagList from "./components/HashTagList";
import DifferentPost from "./components/DifferentStyle";
import SimilarStyle from "./components/SimilarStyle";
import { getPickStatus, togglePickFeed } from "../../api/pickApi";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  arrows: true,
};

function FeedDetail() {
  const { authUserId } = useContext(UserContext);
  const { postId } = useParams();
  const [setUpModal, setSetUpModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const previousLikeStatus = useRef<boolean | undefined>();
  const previousFeedStatus = useRef<DocumentData | undefined>();
  const previousPickStatus = useRef<boolean | undefined>();

  const { data: feedData, isLoading } = useQuery({
    queryKey: ["feed", postId],
    queryFn: () => getFeed(postId),
    enabled: !!postId,
  });

  const myFeed = authUserId === feedData?.userInfo.userId;

  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${postId}`],
    queryFn: () => getLikeStatus("feed", postId),
    enabled: !!postId,
  });

  const { data: pickStatus } = useQuery({
    queryKey: ["pickStatus", `${authUserId}-${postId}`],
    queryFn: () => {
      if (postId) {
        return getPickStatus(postId);
      }
    },
    enabled: !!postId,
  });

  const toggleLikeMutation = useDebouncedMutation(
    (action: string) => toggleLikeFeed("feed", postId, action),
    {
      onMutate: () => {
        queryClient.cancelQueries({
          queryKey: ["likeStatus", `${authUserId}-${postId}`],
        });

        return {
          previousLikeStatus: previousLikeStatus.current,
          previousFeedStatus: previousFeedStatus.current,
        };
      },
      onError: (
        error: Error,
        variables: string,
        context: {
          previousLikeStatus: boolean;
          previousFeedStatus: DocumentData;
        }
      ) => {
        if (context) {
          queryClient.setQueryData(
            ["likeStatus", `${authUserId}-${postId}`],
            context.previousLikeStatus
          );

          queryClient.setQueryData(
            ["feed", postId],
            context.previousFeedStatus
          );
        }
      },
    }
  );

  const handleToggleLikeFeed = () => {
    const currentLikeStatus: boolean | undefined = queryClient.getQueryData([
      "likeStatus",
      `${authUserId}-${postId}`,
    ]);

    const currentFeedStatus: DocumentData | undefined =
      queryClient.getQueryData(["feed", postId]);

    previousLikeStatus.current = currentLikeStatus;
    previousFeedStatus.current = currentFeedStatus;

    queryClient.setQueryData(
      ["likeStatus", `${authUserId}-${postId}`],
      !currentLikeStatus
    );

    queryClient.setQueryData(["feed", postId], {
      ...currentFeedStatus,
      likeCount: !currentLikeStatus
        ? currentFeedStatus?.likeCount + 1
        : currentFeedStatus?.likeCount - 1,
    });

    toggleLikeMutation.mutate(!currentLikeStatus ? "like" : "unLike");
  };

  const togglePickMutation = useDebouncedMutation(
    async (action: string) => {
      if (feedData) {
        return togglePickFeed(action, feedData.id, feedData.feedImages);
      }
    },
    {
      onMutate: () => {
        queryClient.cancelQueries({
          queryKey: ["likeStatus", `${authUserId}-${postId}`],
        });

        return { previousPickStatus: previousPickStatus.current };
      },
      onError: (
        error: Error,
        variables: string,
        context: {
          previousPickStatus: boolean;
        }
      ) => {
        queryClient.setQueryData(
          ["likeStatus", `${authUserId}-${postId}`],
          context?.previousPickStatus
        );
      },
    }
  );

  function handleTogglePick() {
    const currentValue: boolean | undefined = queryClient.getQueryData([
      "pickStatus",
      `${authUserId}-${postId}`,
    ]);
    previousPickStatus.current = currentValue;

    queryClient.setQueryData(
      ["pickStatus", `${authUserId}-${postId}`],
      !currentValue
    );

    togglePickMutation.mutate(currentValue ? "unPick" : "pick");
  }

  return (
    <Container>
      <Header title="게시물" />
      {isLoading || !feedData ? (
        <FeedDetailSkeletonUi />
      ) : (
        <ContentBox>
          <FeedHeader>
            <ProfileWrapper>
              <ImageWrapper
                onClick={() => {
                  navigate(`/users/${feedData.userInfo.userId}`);
                }}
              >
                {feedData.userInfo.profileImage ? (
                  <ProfileImage
                    $profileImage={feedData.userInfo.profileImage}
                  />
                ) : (
                  <ProfileIcon icon={faCircleUser} />
                )}
              </ImageWrapper>
              <Wrapper>
                <NickName
                  onClick={() => {
                    navigate(`/users/${feedData.userInfo.userId}`);
                  }}
                >
                  {feedData.userInfo.nickName}
                </NickName>
                <BodyInfo>
                  {feedData.userInfo.gender === "남성" ? "MAN" : "WOMAN"} •{" "}
                  {feedData.userInfo.height}cm • {feedData.userInfo.weight}kg •{" "}
                  {feedData.userInfo.shoesSize}mm
                </BodyInfo>
              </Wrapper>
            </ProfileWrapper>
            {myFeed && (
              <EllipsisBtn
                icon={faEllipsisVertical}
                onClick={() => {
                  setSetUpModal(true);
                }}
              />
            )}
          </FeedHeader>
          {feedData.feedImages.length > 1 ? (
            <Slider {...settings}>
              {feedData.feedImages.map((img: string, index: number) => {
                return (
                  <FeedImage key={index} $imageUrl={img}>
                    <CopyIcon icon={faClone} />
                    {index === 0 && (
                      <BrandBox>
                        {feedData.outer !== "-" && (
                          <Outer>outer : {feedData.outer}</Outer>
                        )}
                        {feedData.top !== "-" && (
                          <Top>top : {feedData.top}</Top>
                        )}
                        {feedData.bottom !== "-" && (
                          <Bottom>bottom : {feedData.bottom}</Bottom>
                        )}
                        {feedData.shoes !== "-" && (
                          <Shoes>shoes : {feedData.shoes}</Shoes>
                        )}
                      </BrandBox>
                    )}
                  </FeedImage>
                );
              })}
            </Slider>
          ) : (
            <FeedImage $imageUrl={feedData.feedImages[0]} />
          )}
          <IconWrapper>
            <HeartCommentWrapper>
              <HeartWrapper>
                <HeartIcon
                  $color={likeStatus}
                  icon={likeStatus ? faSolidHeart : faHeart}
                  onClick={handleToggleLikeFeed}
                />
                {feedData.likeCount !== 0 && (
                  <HeartCount>{feedData.likeCount}</HeartCount>
                )}
              </HeartWrapper>
              {feedData.commentActive && (
                <CommentWrapper>
                  <CommentIcon
                    icon={faComment}
                    onClick={() => {
                      setCommentModal(true);
                    }}
                  />
                  {feedData.commentCount !== 0 && (
                    <CommentCount>{feedData.commentCount}</CommentCount>
                  )}
                </CommentWrapper>
              )}
            </HeartCommentWrapper>
            <BookmarkIcon
              icon={pickStatus ? faSolidBookmark : faBookmark}
              onClick={handleTogglePick}
            />
          </IconWrapper>
          <PostBox>
            <PostNickName>{feedData.userInfo.nickName}</PostNickName>
            <PostText>
              <QuotesLeft icon={faQuoteLeft} /> {feedData.content}{" "}
              <QuotesRight icon={faQuoteRight} />
            </PostText>
          </PostBox>
          <HashTagList tagList={feedData.hashTag} />
          <DifferentPost feedData={feedData} />
          <SimilarStyle feedData={feedData} />
          {(setUpModal || commentModal) && (
            <BlackBackground
              onClick={() => {
                setSetUpModal(false);
                setCommentModal(false);
              }}
            />
          )}
          <FeedSetUpModal
            setUpModal={setUpModal}
            setSetUpModal={setSetUpModal}
            postId={postId}
            userId={feedData?.userId}
            feedImageCount={feedData?.feedImages.length}
            commentActive={feedData.commentActive}
          />
          <CommentModal
            authUserId={authUserId}
            postId={postId}
            commentModal={commentModal}
            setCommentModal={setCommentModal}
          />
        </ContentBox>
      )}
    </Container>
  );
}

const Container = styled.div`
  animation: ${scaleUp} 0.15s linear;
  overflow: hidden;
`;

const ContentBox = styled.div`
  position: relative;
  padding: 130px 0;
`;

const BlackBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.4);
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

const ImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-position: center;
  background-size: cover;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  font-size: 60px;
  color: rgba(1, 1, 1, 0.1);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NickName = styled.div`
  font-size: 18px;
  font-weight: 700;
  &:hover {
    cursor: pointer;
  }
`;

const BodyInfo = styled.div`
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1px;
`;

const EllipsisBtn = styled(FontAwesomeIcon)`
  font-size: 24px;

  &:hover {
    cursor: pointer;
  }
`;

const BrandBox = styled.div`
  position: absolute;
  top: 80px;
  left: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  opacity: 0;
  transition: 0.4s;
`;

const Outer = styled.div`
  padding: 4px 12px 8px;
  border-radius: 6px;
  background-color: #edf6fc;
  color: #2793fb;
  font-size: 14px;
  opacity: 0.7;
`;

const Top = styled(Outer)``;

const Bottom = styled(Outer)``;

const Shoes = styled(Outer)``;

const FeedImage = styled.div<{ $imageUrl: string }>`
  position: relative;
  width: 100%;
  height: 500px;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-position: center;
  background-size: cover;

  &:hover {
    & > ${BrandBox} {
      opacity: 1;
    }
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 20px;
  right: 20px;
  color: #fff;
  font-size: 28px;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
`;

const HeartCommentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const HeartWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeartIcon = styled(FontAwesomeIcon)<{ $color: boolean | undefined }>`
  color: ${({ $color }) => ($color ? "#f50100" : "#222")};
  font-size: 28px;

  &:hover {
    cursor: pointer;
  }
`;

const HeartCount = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

const CommentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CommentIcon = styled(FontAwesomeIcon)`
  font-size: 28px;

  &:hover {
    cursor: pointer;
  }
`;

const CommentCount = styled.div`
  font-size: 18px;
`;

const BookmarkIcon = styled(FontAwesomeIcon)`
  font-size: 28px;

  &:hover {
    cursor: pointer;
  }
`;

const PostBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px 20px;
  margin: 0 20px 24px;
  border-radius: 8px;
  border: 1px solid rgba(1, 1, 1, 0.6);
`;

const PostNickName = styled.div`
  font-size: 14px;
  font-weight: 600;
`;

const PostText = styled.div``;

const QuotesLeft = styled(FontAwesomeIcon)``;

const QuotesRight = styled(FontAwesomeIcon)``;

export default FeedDetail;
