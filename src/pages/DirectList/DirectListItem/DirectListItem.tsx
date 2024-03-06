import { DocumentData } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useMemo, useState } from "react";
import UserContext from "../../../contexts/UserContext";
import { leaveMessageRoom, subscribeMessages } from "../../../api/directApi";
import { useMutation } from "@tanstack/react-query";

interface Props {
  room: DocumentData;
}

const DirectListItem: React.FC<Props> = ({ room }) => {
  const { authUserId } = useContext(UserContext);
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const [slide, setSlide] = useState(false);
  const navigate = useNavigate();
  const roomId = room.id;
  const userInfo = room.participantsInfo[0];
  const visible = room.visible.includes(authUserId);

  useEffect(() => {
    const unsubscribe = subscribeMessages(userInfo.userId, (newMessages) => {
      setMessages([...newMessages]);
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userInfo.userId]);

  const notReadMessageCount = useMemo(() => {
    const filteredList = messages.filter(
      (message: DocumentData) => !message.readBy.includes(authUserId)
    );
    const count = filteredList.length;
    return count;
  }, [messages, authUserId]);

  const leaveMessageRoomMutation = useMutation({
    mutationFn: () => leaveMessageRoom(roomId),
  });

  function handleMutation() {
    leaveMessageRoomMutation.mutate();
    setSlide((prev) => !prev);
  }

  if (!visible) {
    return;
  }

  return (
    <Container>
      <LeaveBtn
        onClick={() => {
          const check = confirm("대화방을 나가시겠습니까?");
          if (check) {
            handleMutation();
          }
        }}
      >
        나가기
      </LeaveBtn>
      <ListItemContainer
        $backgroundColor={notReadMessageCount > 0}
        $slide={slide}
      >
        <FlexStartWrapper
          onClick={() => {
            navigate(`/direct/${userInfo.userId}`);
          }}
        >
          {userInfo.profileImage ? (
            <ProfileImage $profileImage={userInfo.profileImage} />
          ) : (
            <ProfileIcon />
          )}
          <Wrapper>
            <Nickname>{userInfo.nickName}</Nickname>
            <LastMessage>
              {messages[messages.length - 1]?.message.slice(0, 20)}
              {messages[messages.length - 1]?.message.length > 20 && "..."}
            </LastMessage>
          </Wrapper>
          {notReadMessageCount > 0 && (
            <NotReadMessageCount>{notReadMessageCount}</NotReadMessageCount>
          )}
        </FlexStartWrapper>
        <FlexEndWrapper>
          <EllipsisIcon
            icon={faEllipsisVertical}
            onClick={() => {
              setSlide((prev) => !prev);
            }}
          />
        </FlexEndWrapper>
      </ListItemContainer>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;

const ListItemContainer = styled.div<{
  $backgroundColor: boolean;
  $slide: boolean;
}>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 16px 20px;
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor ? "#ebebeb" : "#fff"};
  transform: translateX(${({ $slide }) => ($slide ? "-20%" : "0px")});
  transition: 0.3s;
`;

const FlexStartWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-size: cover;
  background-position: center;
`;

const ProfileIcon = styled.div``;

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Nickname = styled.div`
  font-size: 18px;
  font-weight: 600;
`;

const LastMessage = styled.div`
  font-size: 14px;
  color: rgba(1, 1, 1, 0.4);
`;

const FlexEndWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NotReadMessageCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f50100;
  color: #fff;
  font-size: 12px;
`;

const EllipsisIcon = styled(FontAwesomeIcon)`
  font-size: 24px;
  color: rgba(1, 1, 1, 0.9);
  &:hover {
    cursor: pointer;
  }
`;

const LeaveBtn = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: rgba(245, 1, 0, 0.3);
  color: #fff;
  padding-right: 24px;
  transition: 0.3s;
  &:hover {
    cursor: pointer;
    background-color: rgba(245, 1, 0, 0.9);
  }
`;

export default DirectListItem;
