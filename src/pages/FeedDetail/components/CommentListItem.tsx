import { DocumentData, DocumentSnapshot } from "firebase/firestore";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment } from "../../../api/commentApi";

interface Props {
  comment: DocumentData;
  postId: string | undefined;
}

const CommentListItem: React.FC<Props> = ({ comment, postId }) => {
  const queryClient = useQueryClient();

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
        alert("정상적으로 삭제되지 않았습니다.");
        queryClient.setQueryData(
          ["comments", postId],
          context.previousComments
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed", postId] });
    },
  });

  function handleRemove() {
    commentRemoveMutation.mutate();
  }

  return (
    <Container>
      <FlexStartWrapper>
        <ProfileImage $profileImage={comment.userInfo.profileImage} />
        <ProfileIcon />
        <Wrapper>
          <NickName>{comment.userInfo.nickName}</NickName>
          <Comment>{comment.comment}</Comment>
          <BtnWrapper>
            <ReplyBtn>답글 달기</ReplyBtn>
            <EditBtn icon={faPenToSquare} />
            <RemoveBtn
              icon={faTrashCan}
              onClick={() => {
                const check = confirm("정말 삭제하시겠습니까?");
                if (check) {
                  handleRemove();
                }
              }}
            />
          </BtnWrapper>
        </Wrapper>
      </FlexStartWrapper>
      <FlexEndWrapper>
        <HeartIcon icon={faHeart} />
        <SolidHeartIcon icon={faSolidHeart} />
        {comment.likeCount !== 0 && <LikeCount>{comment.likeCount}</LikeCount>}
      </FlexEndWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const FlexStartWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-position: center;
  background-size: cover;
`;

const ProfileIcon = styled.div``;

const Wrapper = styled.div`
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

const BtnWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

const ReplyBtn = styled.div`
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const RemoveBtn = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;

  &:hover {
    cursor: pointer;
    color: #f50100;
  }
`;

const EditBtn = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;

  &:hover {
    cursor: pointer;
    color: rgba(1, 1, 1, 0.9);
  }
`;

const FlexEndWrapper = styled.div`
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

const LikeCount = styled.div``;

export default CommentListItem;
