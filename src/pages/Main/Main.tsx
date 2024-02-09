import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllFeeds } from "../../api/postApi";
import FeedListItem from "./components/FeedListItem";
import { useContext, useEffect, useState } from "react";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import MainSkeletonUi from "./components/MainSkeletonUi";
import LoadingSpinner from "../../components/LoadingSpinner";
import UserContext from "../../contexts/UserContext";

function Main() {
  const { authUserId } = useContext(UserContext);
  const [initialLoading, setInitialLoading] = useState(true);
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["allFeeds", authUserId],
      queryFn: ({ pageParam }) => getAllFeeds(6, pageParam),
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
      {initialLoading ? (
        <MainSkeletonUi />
      ) : (
        <ContentBox>
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
                        />
                      );
                    })}
                  </PageGroup>
                )
              );
            })}
          </FeedListBox>
          <Observer ref={ref}>
            {isFetchingNextPage && <LoadingSpinner />}
          </Observer>
        </ContentBox>
      )}
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
  z-index: 1;
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

// const FilterWrapper = styled.div`
//   width: 100px;
//   height: 50px;
//   margin-bottom: 30px;
// `;

// const OrderLatest = styled.div``;

// const OrderPopular = styled.div``;

const FeedListBox = styled.div``;

const PageGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px 10px;
  margin-bottom: 50px;
`;

const Observer = styled.div``;

export default Main;
