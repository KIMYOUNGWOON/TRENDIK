import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentSlash } from "@fortawesome/free-solid-svg-icons";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { activeComment, deleteFeed } from "../../../api/postApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import { DocumentData } from "firebase/firestore";

interface Props {
  setUpModal: boolean;
  setSetUpModal: Dispatch<SetStateAction<boolean>>;
  postId: string | undefined;
  userId: string;
  feedImageCount: number;
  commentActive: boolean;
}

const FeedSetUpModal: React.FC<Props> = ({
  setUpModal,
  setSetUpModal,
  postId,
  userId,
  feedImageCount,
  commentActive,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const deleteFeedMutation = useMutation({
    mutationFn: () => deleteFeed(postId, feedImageCount),
    onSuccess: () => navigate(`/users/${userId}`, { replace: true }),
  });

  function handleDelete() {
    deleteFeedMutation.mutate();
  }

  const activeCommentMutation = useMutation({
    mutationFn: (action: string) => activeComment(action, postId),
    onMutate: (action) => {
      const previousValue = queryClient.getQueryData(["feed", postId]);
      const value = action === "able" ? true : false;
      if (previousValue) {
        queryClient.setQueryData(["feed", postId], {
          ...previousValue,
          commentActive: value,
        });
      }
      setSetUpModal(false);

      return { previousValue };
    },
    onError: (error, variables, context) => {
      console.error(`An error occurred while ${variables}: ${error.message}`);
      queryClient.setQueryData(["feed", postId], context?.previousValue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feed", postId] });
    },
  });

  function handleActiveComment() {
    const currentValue: DocumentData | undefined = queryClient.getQueryData([
      "feed",
      postId,
    ]);

    const action = currentValue?.commentActive ? "disable" : "able";

    activeCommentMutation.mutate(action);
  }
  return (
    <Container $isOpened={setUpModal}>
      <Wrapper>
        <SetUpIcon
          icon={commentActive ? faCommentSlash : faComment}
          $color="black"
        />
        <SetUpText
          $color="black"
          onClick={() => {
            handleActiveComment();
          }}
        >
          {commentActive ? "댓글 기능 해제" : "댓글 기능 활성화"}
        </SetUpText>
      </Wrapper>
      <Wrapper
        onClick={() => {
          navigate(`/feeds/${postId}/edit`);
        }}
      >
        <SetUpIcon icon={faPenToSquare} $color="black" />
        <SetUpText $color="black">게시물 수정</SetUpText>
      </Wrapper>
      <Wrapper
        onClick={() => {
          const check = confirm("정말 삭제하시겠습니까?");
          if (check) {
            handleDelete();
          }
        }}
      >
        <SetUpIcon icon={faTrashCan} $color="red" />
        <SetUpText $color="red">게시물 삭제</SetUpText>
      </Wrapper>
      <CloseBtn
        onClick={() => {
          setSetUpModal(false);
        }}
      >
        닫기
      </CloseBtn>
    </Container>
  );
};

const Container = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  left: 50%;
  top: 100px;
  width: 500px;
  height: 310px;
  padding: 0 30px;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  transform: translate(-50%, ${({ $isOpened }) => ($isOpened ? "0" : "-100%")});
  transition: 0.3s;
  overflow: hidden;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);

  &:hover {
    cursor: pointer;
  }
`;

const SetUpIcon = styled(FontAwesomeIcon)<{ $color: string }>`
  color: ${({ $color }) => ($color === "black" ? "#222" : "#f50100")};
  font-size: 24px;
`;

const SetUpText = styled.div<{ $color: string }>`
  color: ${({ $color }) => ($color === "black" ? "#222" : "#f50100")};
`;

const CloseBtn = styled.div`
  text-align: right;
  margin-top: 24px;

  &:hover {
    cursor: pointer;
  }
`;

export default FeedSetUpModal;
