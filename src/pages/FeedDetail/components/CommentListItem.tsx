import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faArrowTurnUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import {
  InfiniteData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment, editComment } from "../../../api/commentApi";
import { getLikeStatus, toggleLikeFeed } from "../../../api/likeApi";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useDebouncedMutation } from "../../../hooks/useDebouncedMutation";
import { getReplies } from "../../../api/replyApi";
import ReplyListItem from "./ReplyListItem";

interface Props {
  authUserId: string;
  feedUserId: string | undefined;
  postId: string | undefined;
  comment: DocumentData;
  commentModal: boolean;
  replyVisible: boolean;
  changeReplyMode: (postId: string, nickName: string) => void;
  toggleReplyVisible: () => void;
}

const CommentListItem: React.FC<Props> = ({
  authUserId,
  feedUserId,
  postId,
  comment,
  commentModal,
  replyVisible,
  changeReplyMode,
  toggleReplyVisible,
}) => {
  const [slideOpen, setSlideOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();
  const previousLikeStatus = useRef<boolean | undefined>();
  const previousCommentsStatus = useRef<DocumentData | undefined>();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const { data } = useQuery({
    queryKey: ["replies", comment.id],
    queryFn: () => getReplies(comment.id),
  });

  const replies = Array.isArray(data) ? data : [];

  useEffect(() => {
    if (!slideOpen && !editMode) {
      setInputValue(comment.comment);
    }
  }, [slideOpen, editMode, comment.comment]);

  useEffect(() => {
    setSlideOpen(false);
  }, [commentModal]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const { data: likeStatus } = useQuery({
    queryKey: ["likeStatus", `${authUserId}-${comment.id}`],
    queryFn: () => getLikeStatus("comment", comment.id),
  });

  const toggleLikeMutation = useDebouncedMutation(
    (action: string) => toggleLikeFeed("comment", comment.id, action),
    {
      onMutate: () => {
        queryClient.cancelQueries({
          queryKey: ["likeStatus", `${authUserId}-${comment.id}`],
        });

        return {
          previousLikeStatus: previousLikeStatus.current,
          previousCommentsStatus: previousCommentsStatus.current,
        };
      },
      onError: (
        error: Error,
        variables: string,
        context: {
          previousLikeStatus: boolean;
          previousCommentsStatus: DocumentData;
        }
      ) => {
        if (context) {
          queryClient.setQueryData(
            ["likeStatus", `${authUserId}-${comment.id}`],
            context.previousLikeStatus
          );

          queryClient.setQueryData(
            ["comment", comment.id],
            context.previousCommentsStatus
          );
        }
      },
    }
  );

  const commentEditMutation = useMutation({
    mutationFn: () => editComment(comment.id, inputValue),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);

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
            pages: prev.pages.map((page) => {
              return {
                ...page,
                comments: page.comments.map((el) => {
                  if (el.id === comment.id) {
                    return { ...el, comment: inputValue };
                  } else {
                    return { ...el };
                  }
                }),
              };
            }),
          };
        }
      );
      setEditMode(false);

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
    },
  });

  const commentRemoveMutation = useMutation({
    mutationFn: () => deleteComment(comment.id, postId),
    onMutate: () => {
      queryClient.cancelQueries({
        queryKey: ["comments", postId],
      });

      const previousComments = queryClient.getQueryData(["comments", postId]);

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
            pages: prev.pages.map((page) => {
              return {
                ...page,
                comments: page.comments.filter((el) => el.id !== comment.id),
              };
            }),
          };
        }
      );

      return { previousComments };
    },
    onError: (error, variables, context) => {
      if (context) {
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

  const handleToggleLikeFeed = () => {
    const currentLikeStatus: boolean | undefined = queryClient.getQueryData([
      "likeStatus",
      `${authUserId}-${comment.id}`,
    ]);

    const currentCommentsStatus: DocumentData | undefined =
      queryClient.getQueryData(["comments", postId]);

    previousLikeStatus.current = currentLikeStatus;
    previousCommentsStatus.current = currentCommentsStatus;

    queryClient.setQueryData(
      ["likeStatus", `${authUserId}-${comment.id}`],
      !currentLikeStatus
    );

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
          pages: prev.pages.map((page) => {
            return {
              ...page,
              comments: page.comments.map((el) => {
                if (el.id === comment.id) {
                  const likeAdjustment = !currentLikeStatus ? 1 : -1;
                  return { ...el, likeCount: el.likeCount + likeAdjustment };
                } else {
                  return { ...el };
                }
              }),
            };
          }),
        };
      }
    );
    toggleLikeMutation.mutate(!currentLikeStatus ? "like" : "unLike");
  };

  function handleRemove() {
    commentRemoveMutation.mutate();
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commentEditMutation.mutate();
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  return (
    <>
      <Container>
        <CommentWrapper
          $isFresh={comment.fresh}
          $isClicked={slideOpen}
          $isChecked={comment.type === "gif" || comment.userId !== authUserId}
        >
          <FlexStartWrapper
            onClick={() => {
              setSlideOpen(false);
            }}
          >
            {comment.userInfo.profileImage ? (
              <ProfileImage $profileImage={comment.userInfo.profileImage} />
            ) : (
              <ProfileIcon icon={faCircleUser} />
            )}
            <Wrapper>
              <NickName>{comment.userInfo.nickName}</NickName>
              {editMode ? (
                <EditForm onSubmit={handleSubmit}>
                  <EditTextArea
                    ref={textAreaRef}
                    value={inputValue}
                    onChange={handleChange}
                  />
                  <EditBtn>
                    <EditButtonIcon icon={faArrowUpLong} />
                  </EditBtn>
                  <EditCancelButton
                    onClick={() => {
                      setEditMode(false);
                    }}
                  >
                    수정 취소
                  </EditCancelButton>
                </EditForm>
              ) : comment.type === "comment" ? (
                <Comment>{comment.comment}</Comment>
              ) : (
                <GIf src={comment.gif} />
              )}
              <BtnWrapper>
                <ReplyWrapper>
                  <ReplyIcon icon={faArrowTurnUp} rotation={90} />
                  <ReplyText
                    onClick={() => {
                      changeReplyMode(comment.id, comment.userInfo.nickName);
                    }}
                  >
                    답글 달기
                  </ReplyText>
                </ReplyWrapper>
                <LikeWrapper>
                  {likeStatus ? (
                    <SolidHeartIcon
                      icon={faSolidHeart}
                      onClick={handleToggleLikeFeed}
                    />
                  ) : (
                    <HeartIcon icon={faHeart} onClick={handleToggleLikeFeed} />
                  )}
                  {comment.likeCount !== 0 && (
                    <LikeCount>{comment.likeCount}</LikeCount>
                  )}
                </LikeWrapper>
              </BtnWrapper>
            </Wrapper>
          </FlexStartWrapper>
          {(comment.userId === authUserId || feedUserId === authUserId) && (
            <EllipsisIcon
              icon={faEllipsisVertical}
              onClick={() => {
                setSlideOpen((prev) => !prev);
              }}
            />
          )}
        </CommentWrapper>
        <CommentSetUpBox
          $isChecked={comment.type === "gif" || comment.userId !== authUserId}
        >
          {comment.type === "comment" && comment.userId === authUserId && (
            <EditComment
              onClick={() => {
                setEditMode((prev) => !prev);
                setSlideOpen((prev) => !prev);
              }}
            >
              수정
            </EditComment>
          )}
          <DeleteComment
            onClick={() => {
              const check = confirm("정말 삭제하시겠습니까?");
              if (check) {
                handleRemove();
              }
            }}
          >
            삭제
          </DeleteComment>
        </CommentSetUpBox>
      </Container>
      <ReplyList>
        {replyVisible ? (
          replies.map((reply) => (
            <ReplyListItem
              key={reply.id}
              reply={reply}
              authUserId={authUserId}
              feedUserId={feedUserId}
              commentId={comment.id}
              commentModal={commentModal}
            />
          ))
        ) : (
          <VisibleBtn onClick={toggleReplyVisible}>
            <BarElement /> 답글 {replies.length}개 보기
          </VisibleBtn>
        )}
        {replies.length > 0 && replyVisible && (
          <HiddenBtn onClick={toggleReplyVisible}>
            <BarElement /> 답글 숨기기
          </HiddenBtn>
        )}
      </ReplyList>
    </>
  );
};

const Container = styled.div`
  position: relative;
`;

const CommentWrapper = styled.div<{
  $isFresh: boolean;
  $isClicked: boolean;
  $isChecked: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background-color: ${({ $isFresh }) => ($isFresh ? "#fffddd" : "#fff")};
  transform: ${({ $isClicked, $isChecked }) =>
    $isClicked
      ? `translateX(${$isChecked ? "-80px" : "-160px"})`
      : "translateX(0px)"};
  transition: 0.3s;
  z-index: 1;
`;

const FlexStartWrapper = styled.div`
  flex: 1;
  display: flex;
  gap: 10px;
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-position: center;
  background-size: cover;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  font-size: 38px;
  color: rgba(1, 1, 1, 0.1);
`;

const Wrapper = styled.div`
  flex-basis: 380px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NickName = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const Comment = styled.div`
  font-size: 14px;
`;

const GIf = styled.img`
  width: 150px;
  border-radius: 8px;
`;

const BtnWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ReplyWrapper = styled.div`
  color: rgba(1, 1, 1, 0.6);
  display: flex;
  gap: 8px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const ReplyIcon = styled(FontAwesomeIcon)`
  font-size: 12px;
`;

const ReplyText = styled.div`
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;
`;

const LikeWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const HeartIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.5);

  &:hover {
    cursor: pointer;
  }
`;

const SolidHeartIcon = styled(FontAwesomeIcon)`
  color: #f50100;

  &:hover {
    cursor: pointer;
  }
`;

const LikeCount = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const EllipsisIcon = styled(FontAwesomeIcon)`
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;

const CommentSetUpBox = styled.div<{ $isChecked: boolean }>`
  position: absolute;
  top: 0;
  right: 0px;
  display: flex;
  width: ${({ $isChecked }) => ($isChecked ? "80px" : "160px")};
  height: 100%;
`;

const EditComment = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: 500;
  background-color: rgba(1, 1, 1, 0.2);
  color: #fff;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background-color: rgba(1, 1, 1, 0.8);
  }
`;

const DeleteComment = styled(EditComment)`
  background-color: rgba(255, 1, 0, 0.3);

  &:hover {
    background-color: rgba(255, 1, 0, 0.9);
  }
`;

const EditForm = styled.form`
  position: relative;
`;

const EditTextArea = styled.textarea`
  width: 100%;
  padding: 10px 56px 10px 14px;
  border: 1px solid rgba(1, 1, 1, 0.2);
  border-radius: 8px;
  color: rgba(1, 1, 1, 0.8);
  outline: none;
  resize: none;
  transition: 0.3s;
  overflow-y: hidden;

  &:focus {
    border: 1px solid rgba(1, 1, 1, 0.8);
  }

  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
    font-size: 14px;
  }
`;

const EditBtn = styled.button`
  display: block;
  position: absolute;
  top: 13px;
  right: 13px;
  height: 26px;
  width: 38px;
  border: none;
  border-radius: 8px;
  background-color: #1375ff;

  &:hover {
    cursor: pointer;
  }
`;

const EditButtonIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-weight: 700;
  font-size: 12px;
`;

const EditCancelButton = styled.div`
  position: absolute;
  bottom: -24px;
  right: 10px;
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    color: #f50100;
  }
`;

const ReplyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const VisibleBtn = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 62px;
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const HiddenBtn = styled(VisibleBtn)``;

const BarElement = styled.div`
  width: 24px;
  height: 1px;
  background-color: rgba(1, 1, 1, 0.1);
`;

export default CommentListItem;
