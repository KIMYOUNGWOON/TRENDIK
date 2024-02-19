import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteReply, editReply } from "../../../api/replyApi";

interface Props {
  reply: DocumentData;
  authUserId: string;
  feedUserId: string | undefined;
  commentId: string;
  commentModal: boolean;
}

const ReplyListItem: React.FC<Props> = ({
  reply,
  authUserId,
  feedUserId,
  commentId,
  commentModal,
}) => {
  const [slideOpen, setSlideOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (!slideOpen && !editMode) {
      setInputValue(reply.reply);
    }
  }, [slideOpen, editMode, reply.reply]);

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

  const editReplyMutation = useMutation({
    mutationFn: (replyId: string) => editReply(replyId, inputValue),
    onMutate: (replyId: string) => {
      queryClient.cancelQueries({
        queryKey: ["replies", commentId],
      });

      const previousvalue = queryClient.getQueryData(["replies", commentId]);

      queryClient.setQueryData(["replies", commentId], (prev: DocumentData[]) =>
        prev.map((reply) => {
          if (reply.id === replyId) {
            return { ...reply, reply: inputValue };
          } else {
            return reply;
          }
        })
      );

      setEditMode(false);

      return { previousvalue };
    },
    onError: (error, variables, context) => {
      console.error(`An error occurred while ${variables}: ${error.message}`);
      if (context) {
        queryClient.setQueryData(["replies", commentId], context.previousvalue);
      }
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    editReplyMutation.mutate(reply.id);
  }

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  const deleteReplyMutation = useMutation({
    mutationFn: (replyId: string) => deleteReply(replyId),
    onMutate: (replyId: string) => {
      queryClient.cancelQueries({
        queryKey: ["replies", commentId],
      });

      const previousValue = queryClient.getQueryData(["replies", commentId]);

      queryClient.setQueryData(["replies", commentId], (prev: DocumentData[]) =>
        prev.filter((reply) => {
          return reply.id !== replyId;
        })
      );

      return { previousValue };
    },
    onError: (error, variables, context) => {
      console.error(`An error occurred while ${variables}: ${error.message}`);
      if (context) {
        queryClient.setQueryData(["replies", commentId], context.previousValue);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });

  function handleRemove(replyId: string) {
    deleteReplyMutation.mutate(replyId);
  }

  return (
    <Container>
      <ReplyWrapper
        $isFresh={reply.fresh}
        $isClicked={slideOpen}
        $isChecked={reply.userId !== authUserId}
      >
        <FlexStartWrapper
          onClick={() => {
            setSlideOpen(false);
          }}
        >
          {reply.userInfo.profileImage ? (
            <ProfileImage $profileImage={reply.userInfo.profileImage} />
          ) : (
            <ProfileIcon icon={faCircleUser} />
          )}
          <Wrapper>
            <Nickname>{reply.userInfo.nickName}</Nickname>
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
            ) : (
              <ReplyContent>{reply.reply}</ReplyContent>
            )}
          </Wrapper>
        </FlexStartWrapper>
        {(reply.userId === authUserId || feedUserId === authUserId) && (
          <EllipsisIcon
            icon={faEllipsisVertical}
            onClick={() => {
              setSlideOpen((prev) => !prev);
            }}
          />
        )}
      </ReplyWrapper>
      <CommentSetUpBox>
        <EditComment
          onClick={() => {
            setEditMode((prev) => !prev);
            setSlideOpen((prev) => !prev);
          }}
        >
          수정
        </EditComment>
        <DeleteComment
          onClick={() => {
            const check = confirm("정말 삭제하시겠습니까?");
            if (check) {
              handleRemove(reply.id);
            }
          }}
        >
          삭제
        </DeleteComment>
      </CommentSetUpBox>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const ReplyWrapper = styled.div<{
  $isFresh: boolean;
  $isClicked: boolean;
  $isChecked: boolean;
}>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding-left: 62px;
  padding-right: 14px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Nickname = styled.div`
  font-size: 12px;
  font-weight: 600;
`;

const ReplyContent = styled.div`
  font-size: 14px;
`;

const EllipsisIcon = styled(FontAwesomeIcon)`
  font-size: 20px;

  &:hover {
    cursor: pointer;
  }
`;

const CommentSetUpBox = styled.div`
  position: absolute;
  top: 0;
  right: 0px;
  display: flex;
  width: 160px;
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

export default ReplyListItem;
