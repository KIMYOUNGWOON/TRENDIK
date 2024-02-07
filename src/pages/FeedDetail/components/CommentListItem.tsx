import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";

interface Props {
  comment: DocumentData;
}

const CommentListItem: React.FC<Props> = ({ comment }) => {
  return (
    <Container>
      <FlexStartWrapper>
        <ProfileImage $profileImage={comment.userInfo.profileImage} />
        <ProfileIcon />
        <Wrapper>
          <NickName>{comment.userInfo.nickName}</NickName>
          <Comment>{comment.comment}</Comment>
          <ReplyBtn>답글 달기</ReplyBtn>
        </Wrapper>
      </FlexStartWrapper>
      <FlexEndWrapper>
        <HeartIcon icon={faHeart} />
        <HeartIcon icon={faSolidHeart} />
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

const ReplyBtn = styled.div`
  color: rgba(1, 1, 1, 0.6);
  font-size: 12px;

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const FlexEndWrapper = styled.div`
  display: flex;
  gap: 6px;
`;

const HeartIcon = styled(FontAwesomeIcon)``;

const LikeCount = styled.div``;

export default CommentListItem;
