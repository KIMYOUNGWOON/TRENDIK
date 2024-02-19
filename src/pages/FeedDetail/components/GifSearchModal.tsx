import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import { IGif } from "@giphy/js-types";
import { ChangeEvent, SyntheticEvent, useContext, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postComment } from "../../../api/commentApi";
import UserContext from "../../../contexts/UserContext";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

interface Props {
  gifModal: boolean;
  toggleGIfModal: () => void;
  postId: string | undefined;
  authUser: DocumentData | undefined | null;
  scrollToTop: () => void;
}

const GifSearchModal: React.FC<Props> = ({
  gifModal,
  toggleGIfModal,
  postId,
  authUser,
  scrollToTop,
}) => {
  const [inputValue, setInputValue] = useState("");
  const { authUserId } = useContext(UserContext);
  const queryClient = useQueryClient();
  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
  const gf = new GiphyFetch(GIPHY_API_KEY);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  const postGifMutation = useMutation({
    mutationFn: (gifUrl: string) => postComment("gif", gifUrl, postId),
    onMutate: (gifUrl: string) => {
      queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);
      const newComment = {
        id: "",
        userId: authUserId,
        userInfo: authUser,
        feedId: postId,
        type: "gif",
        gif: gifUrl,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        fresh: true,
      };

      queryClient.setQueryData(
        ["comments", postId],
        (
          prev: InfiniteData<{
            comments: DocumentData[];
            lastVisible: DocumentSnapshot<DocumentData, DocumentData> | null;
          }>
        ) => {
          return {
            ...prev,
            pages: [
              {
                ...prev.pages[0],
                comments: [newComment, ...prev.pages[0].comments],
              },
              ...prev.pages.slice(1),
            ],
          };
        }
      );

      scrollToTop();
      toggleGIfModal();

      return { previousComments };
    },
    onError: (error, variables, context) => {
      console.error(`An error occurred while ${variables}: ${error.message}`);
      if (context) {
        alert("정상적으로 업로드되지 않았습니다.");
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed", postId] });
    },
  });

  const onGifClick = (
    selectedGif: IGif,
    e: SyntheticEvent<HTMLElement, Event>
  ) => {
    e.preventDefault();
    const gifUrl = selectedGif.images.original.url;
    postGifMutation.mutate(gifUrl);
  };

  return (
    <Container $isOpened={gifModal}>
      <Header>
        <CloseBar
          onClick={() => {
            toggleGIfModal();
            setInputValue("");
          }}
        />
        <SearchBarBox>
          <SearchIcon icon={faMagnifyingGlass} />
          <SearchInput
            type="text"
            placeholder="GIPHY 검색"
            value={inputValue}
            onChange={handleChange}
          />
        </SearchBarBox>
      </Header>
      <GifListBox>
        <Grid
          width={485}
          columns={3}
          fetchGifs={(offset) =>
            inputValue
              ? gf.search(inputValue, { offset, limit: 10 })
              : gf.trending({ offset, limit: 10 })
          }
          key={inputValue}
          onGifClick={onGifClick}
        />
      </GifListBox>
    </Container>
  );
};

const Container = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  height: 100%;
  bottom: 0;
  background-color: #414141;
  z-index: 1;
  overflow-y: scroll;
  transform: translateY(${({ $isOpened }) => ($isOpened ? "0" : "100%")});
  transition: 0.3s;
`;

const Header = styled.div`
  position: sticky;
  top: 0;
  padding: 18px 0;
  background-color: #414141;
  z-index: 1;
`;

const CloseBar = styled.div`
  width: 90px;
  height: 4px;
  margin: 0 auto;
  border-radius: 20px;
  background-color: #c7c7c7;
  margin-bottom: 30px;
  &:hover {
    cursor: pointer;
  }
`;

const SearchBarBox = styled.div`
  position: relative;
  margin-bottom: 30px;
  padding: 0 20px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 12px;
  left: 36px;
  color: #c7c7c7;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 46px;
  border-radius: 8px;
  border: none;
  background-color: #686868;
  color: #c7c7c7;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: #c7c7c7;
  }
`;

const GifListBox = styled.div`
  padding-bottom: 40px;
`;

export default GifSearchModal;
