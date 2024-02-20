import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllFeeds } from "../../api/postApi";
import FeedListItem from "./components/FeedListItem";
import { useContext, useEffect, useState } from "react";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserContext from "../../contexts/UserContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import romantic from "../../assets/images/romantic.jpg";
import modern from "../../assets/images/modern.jpg";
import minimal from "../../assets/images/minimal.jpg";
import vintage from "../../assets/images/vintage.jpg";
import street from "../../assets/images/street.jpg";
import sporty from "../../assets/images/sporty.jpg";
import amekaji from "../../assets/images/amekaji.jpg";
import casual from "../../assets/images/casual.jpg";
import classic from "../../assets/images/classic.jpg";

const FilterTypes = [
  { id: 1, type: "gender", value: "MAN", text: "남성", image: "" },
  { id: 2, type: "gender", value: "WOMAN", text: "여성", image: "" },
  {
    id: 3,
    type: "style",
    value: "romantic",
    text: "로맨틱",
    image: romantic,
  },
  {
    id: 4,
    type: "style",
    value: "modern",
    text: "모던",
    image: modern,
  },
  {
    id: 5,
    type: "style",
    value: "minimal",
    text: "미니멀",
    image: minimal,
  },
  {
    id: 6,
    type: "style",
    value: "vintage",
    text: "빈티지",
    image: vintage,
  },
  {
    id: 7,
    type: "style",
    value: "street",
    text: "스트릿",
    image: street,
  },
  {
    id: 8,
    type: "style",
    value: "sporty",
    text: "스포티",
    image: sporty,
  },
  {
    id: 9,
    type: "style",
    value: "amekaji",
    text: "아메카지",
    image: amekaji,
  },
  {
    id: 10,
    type: "style",
    value: "casual",
    text: "캐주얼",
    image: casual,
  },
  {
    id: 11,
    type: "style",
    value: "classic",
    text: "클래식",
    image: classic,
  },
];

function Main() {
  const { authUserId } = useContext(UserContext);
  const [sort, setSort] = useState("createdAt");
  const [initialLoading, setInitialLoading] = useState(true);
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["allFeeds", sort],
      queryFn: ({ pageParam }) => getAllFeeds(10, pageParam, sort),
      getNextPageParam: (lastPage: {
        feedList: DocumentData[];
        lastVisible: DocumentSnapshot | null;
      }) => lastPage.lastVisible ?? null,
      initialPageParam: null,
    });

  useEffect(() => {
    if (!isFetching && initialLoading) {
      setInitialLoading(false);
    }

    if (!isFetching && inView && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, initialLoading, inView, hasNextPage, fetchNextPage]);

  return (
    <Container>
      <Helmet>
        <meta
          name="description"
          content="TRENDIK에서 다양한 패션 스타일을 탐색하세요. 패션 스타일로그 일기장을 통해 매일 스타일링을 기록하는 재미와 다른 유저들의 패션 센스를 탐색하는 새로운 공간 경험을 제공합니다."
        />
        <meta
          name="keywords"
          content="패션, 스타일, 로맨틱, 모던, 미니멀, 빈티지, 스트릿,패션 트렌드, 스타일로그"
        />
      </Helmet>
      <Header>
        <TextLogo>TRENDIK.</TextLogo>
        <MenuButton
          icon={faBars}
          onClick={() => {
            navigate("/menu");
            window.scrollTo(0, 0);
          }}
        />
      </Header>
      <ContentBox>
        <FilterList>
          <Swiper spaceBetween={2} slidesPerView={5}>
            {FilterTypes.map((filter) => {
              return (
                <SwiperSlide key={filter.id}>
                  <FilterListItem
                    onClick={() => {
                      navigate(`/feeds/filter?${filter.type}=${filter.text}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {filter.type === "gender" ? (
                      <FilterText>{filter.value}</FilterText>
                    ) : (
                      <FilterImage src={filter.image} alt="filter-image" />
                    )}
                    <FilterListText>{filter.text}</FilterListText>
                  </FilterListItem>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </FilterList>
        <SortWrapper>
          <LikeSort
            $isClicked={sort === "likeCount"}
            onClick={() => {
              setSort("likeCount");
            }}
          >
            인기순
          </LikeSort>
          <LatestSort
            $isClicked={sort === "createdAt"}
            onClick={() => {
              setSort(`createdAt`);
            }}
          >
            최신순
          </LatestSort>
        </SortWrapper>
        <FeedListBox>
          {data?.pages.map((group, i) => {
            return (
              group.feedList.length !== 0 && (
                <PageGroup key={i}>
                  {group.feedList.map((feed) => {
                    return (
                      <FeedListItem
                        key={feed.id}
                        authUserId={authUserId}
                        feed={feed}
                        initialLoading={initialLoading}
                      />
                    );
                  })}
                </PageGroup>
              )
            );
          })}
        </FeedListBox>
        {data?.pages[0].feedList.length === 8 && (
          <Observer ref={ref}>
            {isFetchingNextPage && <LoadingSpinner />}
          </Observer>
        )}
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 500px;
  height: 70px;
  padding: 0 30px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;
`;

const TextLogo = styled.div`
  font-size: 26px;
  font-weight: 800;
`;

const MenuButton = styled(FontAwesomeIcon)`
  font-size: 28px;
  font-weight: 800;

  &:hover {
    cursor: pointer;
  }
`;

const ContentBox = styled.main`
  padding: 100px 10px;
`;

const FilterList = styled.div`
  margin-bottom: 60px;
`;

const FilterListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  &:hover {
    cursor: pointer;
  }
`;

const FilterText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #ecf6fc;
  color: #2493fb;
  font-weight: 800;
  font-size: 14px;
`;

const FilterImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const FilterListText = styled.div`
  font-size: 14px;
`;

const SortWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
`;

const LikeSort = styled.div<{ $isClicked: boolean }>`
  padding-right: 10px;
  border-right: 1px solid rgba(1, 1, 1, 0.3);
  color: ${({ $isClicked }) =>
    $isClicked ? "rgba(1, 1, 1, 0.9)" : "rgba(1, 1, 1, 0.4)"};
  font-weight: ${({ $isClicked }) => ($isClicked ? "500" : "400")};
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`;

const LatestSort = styled.div<{ $isClicked: boolean }>`
  padding-left: 10px;
  color: ${({ $isClicked }) =>
    $isClicked ? "rgba(1, 1, 1, 0.9)" : "rgba(1, 1, 1, 0.4)"};
  font-size: 14px;
  font-weight: ${({ $isClicked }) => ($isClicked ? "500" : "400")};
  &:hover {
    cursor: pointer;
  }
`;

const FeedListBox = styled.div``;

const PageGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px 10px;
  margin-bottom: 50px;
`;

const Observer = styled.div``;

export default Main;
