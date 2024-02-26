import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import Slider from "react-slick";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { InfiniteData, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLikeStatus, toggleLikeFeed } from "../../../api/likeApi";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainSkeletonUi from "./MainSkeletonUi";
import { useDebouncedMutation } from "../../../hooks/useDebouncedMutation";

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipeToSlide: true,
  arrows: false,
};

interface Props {
  authUserId: string;
  sort: string;
  feed: DocumentData;
  initialLoading: boolean;
}

const FeedListItem: React.FC<Props> = ({
  feed,
  sort,
  authUserId,
  initialLoading,
}) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const previousLikeStatus = useRef<boolean | undefined>();
  const previousAllFeeds = useRef<
    | InfiniteData<
        {
          feedList: DocumentData[];
          lastVisible: DocumentSnapshot | null;
        },
        unknown
      >
    | undefined
  >();

  const { data: likeStatus, isLoading: likeStatusLoading } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${feed.id}`],
    queryFn: () => getLikeStatus("feed", feed.id),
  });

  const toggleLikeMutation = useDebouncedMutation(
    (action: string) => toggleLikeFeed("feed", feed.id, action),
    {
      onMutate: () => {
        queryClient.cancelQueries({
          queryKey: ["likeStatus", `${authUserId}-${feed.id}`],
        });

        return {
          previousLikeStatus: previousLikeStatus.current,
          previousAllFeeds: previousAllFeeds.current,
        };
      },
      onError: (
        error: Error,
        variables: string,
        context: {
          previousLikeStatus: boolean;
          previousAllFeeds: InfiniteData<{
            feedList: DocumentData[];
            lastVisible: DocumentSnapshot | null;
          }>;
        }
      ) => {
        console.error(`An error occurred while ${variables}: ${error.message}`);
        if (context) {
          queryClient.setQueryData(
            ["likeStatus", `${authUserId}-${feed.id}`],
            context.previousLikeStatus
          );

          queryClient.setQueryData(
            ["allFeeds", sort],
            context.previousAllFeeds
          );
        }
      },
    }
  );

  const handleToggleLikeFeed = () => {
    const currentLikeStatus: boolean | undefined = queryClient.getQueryData([
      "likeStatus",
      `${authUserId}-${feed.id}`,
    ]);

    const currentAllFeeds:
      | InfiniteData<
          {
            feedList: DocumentData[];
            lastVisible: DocumentSnapshot | null;
          },
          unknown
        >
      | undefined = queryClient.getQueryData(["allFeeds", sort]);

    previousLikeStatus.current = currentLikeStatus;
    previousAllFeeds.current = currentAllFeeds;

    queryClient.setQueryData(
      ["likeStatus", `${authUserId}-${feed.id}`],
      !currentLikeStatus
    );

    queryClient.setQueryData(
      ["allFeeds", sort],
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
    toggleLikeMutation.mutate(!currentLikeStatus ? "like" : "unLike");
  };

  if (initialLoading || likeStatusLoading) {
    return <MainSkeletonUi />;
  }

  return (
    <Container>
      <FeedHeader>
        <ProfileWrapper>
          {feed.userInfo.profileImage ? (
            <ProfileImage
              $profileImage={feed.userInfo.profileImage}
              onClick={() => {
                navigate(`/users/${feed.userInfo.userId}`);
              }}
            />
          ) : (
            <ProfileIcon
              icon={faCircleUser}
              onClick={() => {
                navigate(`/users/${feed.userInfo.userId}`);
                window.scrollTo(0, 0);
              }}
            />
          )}
          <NickName
            onClick={() => {
              navigate(`/users/${feed.userInfo.userId}`);
              window.scrollTo(0, 0);
            }}
          >
            {feed.userInfo.nickName}
          </NickName>
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
              <FeedImage
                key={index}
                $imageUrl={img}
                onClick={() => {
                  navigate(`/feeds/${feed.id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <CopyIcon icon={faClone} />
              </FeedImage>
            );
          })}
        </Slider>
      ) : (
        <FeedImage
          $imageUrl={feed.feedImages[0]}
          onClick={() => {
            navigate(`/feeds/${feed.id}`);
            window.scrollTo(0, 0);
          }}
        />
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

  &:hover {
    cursor: pointer;
  }
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  font-size: 36px;
  color: rgba(1, 1, 1, 0.1);
`;

const NickName = styled.div`
  font-size: 14px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
  }
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

  &:hover {
    cursor: pointer;
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 16px;
  right: 16px;
  color: #fff;
  font-size: 22px;
`;

export default FeedListItem;
