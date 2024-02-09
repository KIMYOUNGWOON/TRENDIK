import styled from "styled-components";
import { scaleUp } from "../../styles/Animation";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFeed } from "../../api/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import FeedDetailSkeletonUi from "./components/FeedDetailSkeletonUi";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import FeedSetUpModal from "./components/FeedSetUpModal";
import { getLikeStatus, toggleLikeFeed } from "../../api/likeApi";
import UserContext from "../../contexts/UserContext";
import debounce from "lodash/debounce";
import CommentModal from "./components/CommentModal";

function FeedDetail() {
  const { authUserId } = useContext(UserContext);
  const { postId } = useParams();
  const [setUpModal, setSetUpModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: feedData, isLoading } = useQuery({
    queryKey: ["feed", postId],
    queryFn: () => getFeed(postId),
    enabled: !!postId,
  });

  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${postId}`],
    queryFn: () => getLikeStatus(postId),
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (status: string) => toggleLikeFeed(status, postId),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["likeStatus", `${authUserId}-${postId}`],
      });

      const previousStatus = queryClient.getQueryData<boolean>([
        "likeStatus",
        `${authUserId}-${postId}`,
      ]);

      return { previousStatus };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["likeStatus", `${authUserId}-${postId}`],
          context.previousStatus
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeStatus", `${authUserId}-${postId}`],
      });
    },
  });

  const debouncedToggleLike = useRef(
    debounce((status) => {
      toggleLikeMutation.mutate(status);
    }, 1000)
  );

  useEffect(() => {
    const debouncedToggleLikeFn = debouncedToggleLike.current;

    return () => {
      debouncedToggleLikeFn.cancel();
    };
  }, []);

  const previousStatus = useRef<boolean | undefined>();

  const handleToggleLikeFeed = useCallback(() => {
    const currentLikeStatus: boolean | undefined = queryClient.getQueryData([
      "likeStatus",
      `${authUserId}-${postId}`,
    ]);

    queryClient.setQueryData(
      ["likeStatus", `${authUserId}-${postId}`],
      !currentLikeStatus
    );

    if (currentLikeStatus === previousStatus.current) return;

    previousStatus.current = currentLikeStatus;

    debouncedToggleLike.current(!currentLikeStatus ? "like" : "unLike");
  }, [authUserId, postId, queryClient]);

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
      <Header title="게시물" />
      {isLoading || !feedData ? (
        <FeedDetailSkeletonUi />
      ) : (
        <ContentBox>
          <FeedHeader>
            <ProfileWrapper>
              <ImageWrapper>
                {feedData.userInfo.profileImage ? (
                  <ProfileImage
                    $profileImage={feedData.userInfo.profileImage}
                  />
                ) : (
                  <ProfileIcon icon={faCircleUser} />
                )}
              </ImageWrapper>
              <NickName>{feedData.userInfo.nickName}</NickName>
            </ProfileWrapper>
            <EllipsisBtn
              icon={faEllipsisVertical}
              onClick={() => {
                setSetUpModal(true);
              }}
            />
          </FeedHeader>
          {feedData.feedImages.length > 1 ? (
            <Slider {...settings}>
              {feedData.feedImages.map((img: string, index: number) => {
                return (
                  <FeedImage key={index} $imageUrl={img}>
                    <CopyIcon icon={faClone} />
                  </FeedImage>
                );
              })}
            </Slider>
          ) : (
            <FeedImage $imageUrl={feedData.feedImages[0]} />
          )}
          <IconWrapper>
            <HeartCommentWrapper>
              {likeStatus ? (
                <HeartIcon icon={faSolidHeart} onClick={handleToggleLikeFeed} />
              ) : (
                <HeartIcon icon={faHeart} onClick={handleToggleLikeFeed} />
              )}
              <HeartCount>0</HeartCount>
              <CommentIcon
                icon={faComment}
                onClick={() => {
                  setCommentModal(true);
                }}
              />
              <CommentCount>{feedData.commentCount}</CommentCount>
            </HeartCommentWrapper>
            <BookmarkIcon icon={faBookmark} />
          </IconWrapper>
          {(setUpModal || commentModal) && (
            <BlackBackground
              onClick={() => {
                setSetUpModal(false);
                setCommentModal(false);
              }}
            />
          )}
        </ContentBox>
      )}
      <FeedSetUpModal
        setUpModal={setUpModal}
        setSetUpModal={setSetUpModal}
        postId={postId}
        userId={feedData?.userId}
        feedImageCount={feedData?.feedImages.length}
      />
      <CommentModal
        authUserId={authUserId}
        postId={postId}
        commentModal={commentModal}
        setCommentModal={setCommentModal}
      />
    </Container>
  );
}

const Container = styled.div`
  animation: ${scaleUp} 0.15s linear;
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

const NickName = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const EllipsisBtn = styled(FontAwesomeIcon)`
  font-size: 24px;

  &:hover {
    cursor: pointer;
  }
`;

const FeedImage = styled.div<{ $imageUrl: string }>`
  position: relative;
  width: 100%;
  height: 500px;
  background-image: url(${({ $imageUrl }) => $imageUrl});
  background-position: center;
  background-size: cover;
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
`;

const HeartCommentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  font-size: 28px;

  &:hover {
    cursor: pointer;
  }
`;

const HeartCount = styled.div`
  font-size: 18px;
  margin-right: 18px;
`;

const CommentIcon = styled(HeartIcon)``;

const CommentCount = styled.div`
  font-size: 18px;
`;

const BookmarkIcon = styled(HeartIcon)``;

export default FeedDetail;
