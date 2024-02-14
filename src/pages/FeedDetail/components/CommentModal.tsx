import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { getUser } from "../../../api/userApi";
import { getComments, postComment } from "../../../api/commentApi";
import CommentListItem from "./CommentListItem";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import { useInView } from "react-intersection-observer";

interface Props {
  authUserId: string;
  postId: string | undefined;
  commentModal: boolean;
  setCommentModal: Dispatch<SetStateAction<boolean>>;
}

const CommentModal: React.FC<Props> = ({
  authUserId,
  postId,
  commentModal,
  setCommentModal,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const queryClient = useQueryClient();
  const rootRef = useRef(null);
  const { ref, inView } = useInView({
    rootMargin: " 0px 0px -138px 0px",
    root: rootRef.current,
  });
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { data: authUser } = useQuery({
    queryKey: ["authUser", authUserId],
    queryFn: () => getUser(authUserId),
  });

  const {
    data: comments,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam }) => getComments(postId, 10, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage: {
      comments: DocumentData[];
      lastVisible: DocumentSnapshot | null;
    }) => lastPage.lastVisible ?? null,
  });

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    if (!isFetching && initialLoading) {
      setInitialLoading(false);
    }

    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [isFetching, initialLoading, inView, hasNextPage, fetchNextPage]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  const postCommentMutation = useMutation({
    mutationFn: (comment: string) => postComment(comment, postId),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);
      const newComment = {
        id: "",
        userId: authUserId,
        userInfo: authUser,
        feedId: postId,
        comment: inputValue,
        likeCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
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

      setInputValue("");

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context) {
        alert("정상적으로 업로드되지 않았습니다.");
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", postId] });
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const temp = inputValue;
    postCommentMutation.mutate(temp);
  }

  return (
    <Container $isOpened={commentModal}>
      <Header>
        <Title>댓글</Title>
        <CloseBtn
          icon={faArrowDownLong}
          onClick={() => {
            setCommentModal(false);
          }}
        />
      </Header>
      <ContentBox ref={rootRef}>
        {comments?.pages[0].comments.length === 0 ? (
          <CommentEmptyBox>
            <CommentEmptyText>아직 댓글이 없습니다</CommentEmptyText>
            <CommentLeaveText>댓글을 남겨보세요</CommentLeaveText>
          </CommentEmptyBox>
        ) : (
          <CommentList>
            {comments?.pages.map((page, i) => {
              return (
                <PageWrapper key={i}>
                  {page.comments.map((comment) => {
                    return (
                      <CommentListItem
                        key={comment.id}
                        authUserId={authUserId}
                        comment={comment}
                        postId={postId}
                      />
                    );
                  })}
                </PageWrapper>
              );
            })}
          </CommentList>
        )}
        {isFetchingNextPage && (
          <LoadingWrapper>
            <SpinnerIcon icon={faSpinner} spinPulse />
          </LoadingWrapper>
        )}
        {!initialLoading && comments?.pages[0].comments.length === 10 && (
          <Observer ref={ref}></Observer>
        )}
        <CommentForm onSubmit={handleSubmit}>
          {authUser?.profileImage ? (
            <ProfileImage $profileImage={authUser.profileImage} />
          ) : (
            <ProfileIcon icon={faCircleUser} />
          )}
          <CommentTextArea
            name="comment"
            placeholder="댓글 달기..."
            onChange={handleChange}
            value={inputValue}
            ref={textAreaRef}
          />
          {inputValue ? (
            <CommentButton>
              <CommentButtonIcon icon={faArrowUpLong} />
            </CommentButton>
          ) : (
            <GifButton>GIF</GifButton>
          )}
        </CommentForm>
      </ContentBox>
    </Container>
  );
};

const Container = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 70px;
  width: 500px;
  height: 70%;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  background-color: #fff;
  transform: translate(-50%, ${({ $isOpened }) => ($isOpened ? "0" : "100%")});
  transition: 0.3s;
  overflow: hidden;
`;

const Header = styled.div`
  position: relative;
  padding: 24px 0;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
`;

const Title = styled.div`
  font-weight: 500;
  text-align: center;
`;

const CloseBtn = styled(FontAwesomeIcon)`
  position: absolute;
  top: 22px;
  right: 22px;
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;

const ContentBox = styled.div`
  height: 100%;
  padding-bottom: 160px;
  overflow-y: scroll;
`;

const CommentList = styled.div``;

const PageWrapper = styled.div``;

const CommentForm = styled.form`
  display: flex;
  align-items: center;
  gap: 20px;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  border-top: 1px solid rgba(1, 1, 1, 0.1);
  background-color: #fff;
  z-index: 1;
`;

const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 10px 56px 10px 14px;
  border: 1px solid rgba(1, 1, 1, 0.2);
  border-radius: 8px;
  color: rgba(1, 1, 1, 0.8);
  outline: none;
  resize: none;
  transition: 0.3s;
  overflow-y: hidden;

  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
    font-size: 14px;
  }
`;

const CommentButton = styled.button`
  display: block;
  position: absolute;
  right: 30px;
  height: 26px;
  width: 38px;
  border: none;
  border-radius: 8px;
  background-color: #1375ff;

  &:hover {
    cursor: pointer;
  }
`;

const CommentButtonIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-weight: 700;
  font-size: 12px;
`;

const GifButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 30px;
  width: 38px;
  height: 26px;
  border: 2px solid #222;
  border-radius: 8px;
  font-weight: 700;
  font-size: 12px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background-color: #222;
    color: #fff;
  }
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-position: center;
  background-size: cover;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  font-size: 44px;
  color: rgba(1, 1, 1, 0.1);
`;

const Observer = styled.div``;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 48px;
  text-align: center;
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.8);
  font-size: 30px;
`;

const CommentEmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 100%;
`;

const CommentEmptyText = styled.div`
  font-size: 22px;
  font-weight: 600;
`;

const CommentLeaveText = styled.div`
  color: rgba(1, 1, 1, 0.4);
  font-size: 14px;
`;

export default CommentModal;
