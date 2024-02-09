import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import Slider from "react-slick";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getLikeStatus, toggleLikeFeed } from "../../../api/likeApi";
import { useCallback, useEffect, useRef } from "react";
import { debounce } from "lodash";

interface Props {
  authUserId: string;
  feed: DocumentData;
}

const FeedListItem: React.FC<Props> = ({ feed, authUserId }) => {
  const queryClient = useQueryClient();

  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${feed.id}`],
    queryFn: () => getLikeStatus(feed.id),
  });

  const toggleLikeMutation = useMutation({
    mutationFn: (status: string) => toggleLikeFeed(status, feed.id),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["likeStatus", `${authUserId}-${feed.id}`],
      });

      const previousStatus = queryClient.getQueryData([
        "likeStatus",
        `${authUserId}-${feed.id}`,
      ]);

      return { previousStatus };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["likeStatus", `${authUserId}-${feed.id}`],
          context.previousStatus
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["likeStatus", `${authUserId}-${feed.id}`],
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
      `${authUserId}-${feed.id}`,
    ]);

    queryClient.setQueryData(
      ["likeStatus", `${authUserId}-${feed.id}`],
      !currentLikeStatus
    );

    if (currentLikeStatus === previousStatus.current) return;

    previousStatus.current = currentLikeStatus;

    queryClient.setQueryData(
      ["allFeeds", authUserId],
      (
        prev: InfiniteData<{
          feedList: DocumentData[];
          lastVisible: DocumentSnapshot | null;
        }>
      ) => {
        return {
          ...prev,
          pages: prev.pages.map((page) => {
            return {
              ...page,
              feedList: page.feedList.map((post) => {
                if (post.id === feed.id) {
                  const likeAdjustment = currentLikeStatus ? -1 : 1;
                  return {
                    ...post,
                    likeCount: post.likeCount + likeAdjustment,
                  };
                }
                return { ...post };
              }),
            };
          }),
        };
      }
    );
    debouncedToggleLike.current(!currentLikeStatus ? "like" : "unLike");
  }, [authUserId, feed.id, queryClient]);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
  };
  return (
    <Container>
      <FeedHeader>
        <ProfileWrapper>
          <ProfileImage $profileImage={feed.userInfo.profileImage} />
          <NickName>{feed.userInfo.nickName}</NickName>
        </ProfileWrapper>
        <LikeWrapper>
          {likeStatus ? (
            <SolidHeartIcon
              icon={faSolidHeart}
              onClick={handleToggleLikeFeed}
            />
          ) : (
            <HeartIcon icon={faHeart} onClick={handleToggleLikeFeed} />
          )}
          {feed.likeCount > 0 && <LikeCount>{feed.likeCount}</LikeCount>}
        </LikeWrapper>
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

const LikeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  font-size: 20px;
  color: rgba(1, 1, 1, 0.5);

  &:hover {
    cursor: pointer;
  }
`;

const SolidHeartIcon = styled(HeartIcon)`
  font-size: 20px;
  color: #f50100;

  &:hover {
    cursor: pointer;
  }
`;

const LikeCount = styled.div`
  font-weight: 500;
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
