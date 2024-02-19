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
import GifSearchModal from "./GifSearchModal";
import { postingReply } from "../../../api/replyApi";

interface Props {
  authUserId: string;
  feedUserId: string | undefined;
  postId: string | undefined;
  commentModal: boolean;
  setCommentModal: Dispatch<SetStateAction<boolean>>;
}

const initialValue = {
  id: "",
  nickName: "",
};

const CommentModal: React.FC<Props> = ({
  authUserId,
  feedUserId,
  postId,
  commentModal,
  setCommentModal,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [gifModal, setGifModal] = useState(false);
  const [replyMode, setReplyMode] = useState(false);
  const [replyVisible, setReplyVisible] = useState(false);
  const [commentInfo, setCommentInfo] = useState(initialValue);
  const queryClient = useQueryClient();
  const rootRef = useRef<HTMLDivElement | null>(null);
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
    queryFn: ({ pageParam }) => getComments(postId, 16, pageParam),
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

  const scrollToTop = () => {
    if (rootRef.current) {
      rootRef.current.scrollTop = 0;
    }
  };

  const postCommentMutation = useMutation({
    mutationFn: (comment: string) => postComment("comment", comment, postId),
    onMutate: (comment: string) => {
      queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);
      const newComment = {
        id: "",
        userId: authUserId,
        userInfo: authUser,
        feedId: postId,
        type: "comment",
        comment,
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
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed", postId] });
    },
  });

  const postReplyMutation = useMutation({
    mutationFn: (reply: string) => postingReply(commentInfo.id, reply),
    onMutate: (reply: string) => {
      queryClient.cancelQueries({
        queryKey: ["replies", commentInfo.id],
      });

      const previousReplies = queryClient.getQueryData([
        "replies",
        commentInfo.id,
      ]);

      const previousValue = Array.isArray(previousReplies)
        ? previousReplies
        : [];

      const newReply = {
        id: previousValue.length + 1,
        userInfo: authUser,
        commentId: commentInfo.id,
        reply,
        fresh: true,
      };

      queryClient.setQueryData(
        ["replies", commentInfo.id],
        [newReply, ...previousValue]
      );

      setReplyVisible(true);
      setReplyMode(false);
      setInputValue("");

      return { previousValue };
    },
    onError: (error, variables, context) => {
      if (context) {
        alert("정상적으로 업로드되지 않았습니다.");
        queryClient.setQueryData(
          ["replies", commentInfo.id],
          context.previousValue
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentInfo.id] });
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const temp = inputValue;

    if (replyMode) {
      postReplyMutation.mutate(temp);
    } else {
      postCommentMutation.mutate(temp);
    }
  }

  function toggleGIfModal() {
    setGifModal((prev) => !prev);
  }

  function changeReplyMode(id: string, nickName: string) {
    const commentInfo = {
      id,
      nickName,
    };
    textAreaRef.current?.focus();
    setReplyMode(true);
    setCommentInfo(commentInfo);
  }

  function toggleReplyVisible() {
    setReplyVisible((prev) => !prev);
  }

  return (
    <Container $isOpened={commentModal}>
      <Header>
        <Title>댓글</Title>
        <CloseBtn
          icon={faArrowDownLong}
          onClick={() => {
            setCommentModal(false);
            setReplyVisible(false);
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
                        feedUserId={feedUserId}
                        comment={comment}
                        postId={postId}
                        commentModal={commentModal}
                        changeReplyMode={changeReplyMode}
                        replyVisible={replyVisible}
                        toggleReplyVisible={toggleReplyVisible}
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
        {!initialLoading && comments?.pages[0].comments.length === 16 && (
          <Observer ref={ref}></Observer>
        )}
        <CommentForm onSubmit={handleSubmit}>
          {replyMode && (
            <ReplyModeWrapper>
              <ReplyToNickName>
                @{commentInfo.nickName}{" "}
                <ReplyOngoing>님에게 답글 다는 중...</ReplyOngoing>
              </ReplyToNickName>
              <CancelBtn
                onClick={() => {
                  setReplyMode(false);
                  setInputValue("");
                }}
              >
                ✕
              </CancelBtn>
            </ReplyModeWrapper>
          )}
          <Wrapper>
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
            {inputValue || replyMode ? (
              <CommentButton>
                <CommentButtonIcon icon={faArrowUpLong} />
              </CommentButton>
            ) : (
              <GifButton onClick={toggleGIfModal}>GIF</GifButton>
            )}
          </Wrapper>
        </CommentForm>
      </ContentBox>
      <GifSearchModal
        gifModal={gifModal}
        toggleGIfModal={toggleGIfModal}
        postId={postId}
        authUser={authUser}
        scrollToTop={scrollToTop}
      />
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
  z-index: 1;
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
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  border-top: 1px solid rgba(1, 1, 1, 0.1);
  background-color: #fff;
  z-index: 1;
`;

const ReplyModeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-left: 66px;
  padding-right: 10px;
`;

const ReplyToNickName = styled.div`
  color: rgba(1, 1, 1, 0.9);
  font-size: 12px;
  font-weight: 600;
`;

const ReplyOngoing = styled.span`
  color: rgba(1, 1, 1, 0.4);
  font-size: 12px;
  font-weight: 600;
`;

const CancelBtn = styled.div`
  color: rgba(1, 1, 1, 0.9);
  font-size: 14px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const CommentTextArea = styled.textarea`
  flex: 1;
  padding: 10px 56px 12px 14px;
  border: 1px solid rgba(1, 1, 1, 0.2);
  border-radius: 8px;
  color: rgba(1, 1, 1, 0.8);
  outline: none;
  resize: none;
  transition: 0.3s;
  overflow-y: hidden;
  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
    font-size: 12px;
  }
  &:focus {
    border: 1px solid rgba(1, 1, 1, 1);
  }
`;

const CommentButton = styled.button`
  display: block;
  position: absolute;
  right: 10px;
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
  right: 10px;
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
