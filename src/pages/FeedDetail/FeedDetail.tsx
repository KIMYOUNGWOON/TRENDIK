import styled from "styled-components";
import { scaleUp } from "../../styles/Animation";
import Header from "../../components/Header";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFeed } from "../../api/postApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/free-regular-svg-icons";
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
import { getLikeStatus, likeFeed, unLikeFeed } from "../../api/likeAti";
import UserContext from "../../contexts/UserContext";
import debounce from "lodash/debounce";
import CommentModal from "./components/CommentModal";

function FeedDetail() {
  const { authUserId } = useContext(UserContext);
  const { postId } = useParams();
  const [setUpModal, setSetUpModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const queryClient = useQueryClient();
  console.log(setUpModal);

  const { data, isLoading } = useQuery({
    queryKey: ["feed", postId],
    queryFn: () => getFeed(postId),
    enabled: !!postId,
  });

  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${postId}`],
    queryFn: () => getLikeStatus(postId),
  });

  const likeMutation = useMutation({
    mutationFn: () => likeFeed(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({
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

  const unLikeMutation = useMutation({
    mutationFn: () => unLikeFeed(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({
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

  const debouncedLike = useRef(
    debounce(() => {
      likeMutation.mutate();
    }, 400)
  );

  const debouncedUnlike = useRef(
    debounce(() => {
      unLikeMutation.mutate();
    }, 400)
  );

  useEffect(() => {
    const debouncedLikeFn = debouncedLike.current;
    const debouncedUnlikeFn = debouncedUnlike.current;

    return () => {
      debouncedLikeFn.cancel();
      debouncedUnlikeFn.cancel();
    };
  }, []);

  const handleLikeFeed = useCallback(() => {
    queryClient.setQueryData(["likeStatus", `${authUserId}-${postId}`], true);
    debouncedLike.current();
  }, [authUserId, postId, queryClient]);

  const handleUnLikeFeed = useCallback(() => {
    queryClient.setQueryData(["likeStatus", `${authUserId}-${postId}`], false);
    debouncedUnlike.current();
  }, [authUserId, postId, queryClient]);

  const userData = data?.userInfo;

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
      {isLoading || !data ? (
        <FeedDetailSkeletonUi />
      ) : (
        <ContentBox>
          <FeedHeader>
            <ProfileWrapper>
              <ImageWrapper>
                {data.userInfo.profileImage ? (
                  <ProfileImage $profileImage={userData?.profileImage} />
                ) : (
                  <ProfileIcon icon={faCircleUser} />
                )}
              </ImageWrapper>
              <NickName>{data.userInfo.nickName}</NickName>
            </ProfileWrapper>
            <EllipsisBtn
              icon={faEllipsisVertical}
              onClick={() => {
                setSetUpModal(true);
              }}
            />
          </FeedHeader>
          {data.feedImages.length > 1 ? (
            <Slider {...settings}>
              {data.feedImages.map((img: string, index: number) => {
                return (
                  <FeedImage key={index} $imageUrl={img}>
                    <CopyIcon icon={faClone} />
                  </FeedImage>
                );
              })}
            </Slider>
          ) : (
            <FeedImage $imageUrl={data.feedImages[0]} />
          )}
          <IconWrapper>
            <HeartCommentWrapper>
              {likeStatus ? (
                <HeartIcon icon={faSolidHeart} onClick={handleUnLikeFeed} />
              ) : (
                <HeartIcon icon={faHeart} onClick={handleLikeFeed} />
              )}
              <CommentIcon
                icon={faComment}
                onClick={() => {
                  setCommentModal(true);
                }}
              />
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
        userId={data?.userId}
        feedImageCount={data?.feedImages.length}
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
  padding: 24px;
`;

const HeartCommentWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  font-size: 28px;

  &:hover {
    cursor: pointer;
  }
`;

const CommentIcon = styled(HeartIcon)``;

const BookmarkIcon = styled(HeartIcon)``;

export default FeedDetail;
