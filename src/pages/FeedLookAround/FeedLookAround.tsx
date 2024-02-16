import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { getAllFeeds } from "../../api/postApi";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { getPopularTag, postKeyword } from "../../api/searchApi";

function FeedLookAround() {
  const [inputValue, setInputValue] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const { ref, inView } = useInView();
  const navigate = useNavigate();

  const { data: popularTags } = useQuery({
    queryKey: ["hashTags"],
    queryFn: () => getPopularTag(),
  });

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ["allFeeds"],
    queryFn: ({ pageParam }) => getAllFeeds(20, pageParam),
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

  const searchFeedMutation = useMutation({
    mutationFn: (tag: string) => postKeyword(tag),
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    navigate(`/feeds/search?tag=${inputValue}`);
    searchFeedMutation.mutate(inputValue);
  }

  return (
    <Container>
      <Header title="게시물 둘러보기" />
      <ContentBox>
        <SearchBarBox onSubmit={handleSubmit}>
          <SearchIcon icon={faMagnifyingGlass} />
          <SearchInput
            placeholder="# 해시태그로 검색"
            onChange={handleChange}
            value={inputValue}
          />
          <SearchBtn $entered={inputValue}>검색</SearchBtn>
        </SearchBarBox>
        <HashTagListTitle># 인기 해시태그</HashTagListTitle>
        <HashTagListBox>
          {popularTags?.map((tag) => {
            return (
              <HashTag
                key={tag.id}
                onClick={() => {
                  navigate(`/feeds/search?tag=${tag.searchTag}`);
                }}
              >
                {tag.searchTag}
              </HashTag>
            );
          })}
        </HashTagListBox>
        <FeedListBox>
          {data?.pages.map((page, index) => {
            return (
              <PageWrapper key={index}>
                {page.feedList.map((feed) => {
                  return (
                    <FeedListItem
                      key={feed.id}
                      $feedImage={feed.feedImages[0]}
                      onClick={() => {
                        navigate(`/feeds/${feed.id}`);
                      }}
                    >
                      {feed.feedImages.length > 1 && (
                        <CopyIcon icon={faClone} />
                      )}
                      <Background>
                        <ViewText>VIEW</ViewText>
                      </Background>
                    </FeedListItem>
                  );
                })}
              </PageWrapper>
            );
          })}
        </FeedListBox>
        <Observer ref={ref} />
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding-top: 140px;
  background-color: #fff;
`;

const SearchBarBox = styled.form`
  position: relative;
  margin-bottom: 30px;
  padding: 0 30px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  left: 46px;
  font-size: 18px;
  color: rgba(1, 1, 1, 0.3);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 50px;
  border-radius: 8px;
  border: none;
  background-color: rgba(1, 1, 1, 0.1);
  color: rgba(1, 1, 1, 0.6);
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
    font-size: 14px;
  }
`;

const SearchBtn = styled.button<{ $entered: string }>`
  position: absolute;
  top: 7px;
  right: 40px;
  padding: 6px 10px 5px;
  border: none;
  border-radius: 8px;
  background-color: ${({ $entered }) =>
    $entered !== "" ? "rgba(1, 1, 1, 0.9)" : "rgba(1, 1, 1, 0.2)"};
  color: #fff;
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const HashTagListTitle = styled.ul`
  margin-bottom: 16px;
  padding: 0 30px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(1, 1, 1, 0.8);
`;

const HashTagListBox = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 0 30px;
  margin-bottom: 40px;
`;

const HashTag = styled.li`
  padding: 8px 14px;
  color: #2793fb;
  border-radius: 8px;
  background-color: #edf6fc;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`;

const FeedListBox = styled.ul``;

const PageWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
`;

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.3);
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

const FeedListItem = styled.li<{ $feedImage: string }>`
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

const Observer = styled.div``;

export default FeedLookAround;
