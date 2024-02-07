import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useState,
} from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDownLong } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "../../../api/userApi";
import { getComment, postComment } from "../../../api/commentApi";
import CommentListItem from "./CommentListItem";

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
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({
    queryKey: ["authUser", authUserId],
    queryFn: () => getUser(authUserId),
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComment(postId),
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  const postCommentMutation = useMutation({
    mutationFn: () => postComment(inputValue, postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    postCommentMutation.mutate();
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
      {commentsLoading ? (
        <div>asd</div>
      ) : (
        <ContentBox>
          <CommentList>
            {comments?.map((comment) => {
              return <CommentListItem key={comment.id} comment={comment} />;
            })}
          </CommentList>
          <CommentForm onSubmit={handleSubmit}>
            {authUser?.profileImage ? (
              <ProfileImage $profileImage={authUser.profileImage} />
            ) : (
              <ProfileIcon icon={faCircleUser} />
            )}
            <CommentInput
              placeholder="댓글 달기..."
              onChange={handleChange}
              value={inputValue}
            />
            {inputValue ? (
              <CommentButton type="submit">
                <CommentButtonIcon icon={faArrowUpLong} />
              </CommentButton>
            ) : (
              <GifButton>GIF</GifButton>
            )}
          </CommentForm>
        </ContentBox>
      )}
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
  padding-bottom: 140px;
  overflow-y: scroll;
`;

const CommentList = styled.div`
  padding: 14px;
`;

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
`;

const CommentInput = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 30px 0 18px;
  border: 1px solid rgba(1, 1, 1, 0.2);
  border-radius: 10px;
  outline: none;
  transition: 0.3s;
  color: rgba(1, 1, 1, 0.8);

  &:focus {
    border: 1px solid rgba(1, 1, 1, 0.9);
  }

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

export default CommentModal;
