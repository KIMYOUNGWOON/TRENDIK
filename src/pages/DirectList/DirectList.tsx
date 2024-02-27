import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import UserContext from "../../contexts/UserContext";
import { subscribeToMessageRooms } from "../../api/directApi";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import DirectListItem from "./DirectListItem/DirectListItem";
import { DocumentData } from "firebase/firestore";

function DirectList() {
  const { authUserId } = useContext(UserContext);
  const [messageRooms, setMessageRooms] = useState<DocumentData[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToMessageRooms((rooms) => {
      setMessageRooms([...rooms]);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const roomsWithContactInfo = messageRooms
    ? messageRooms.map((room) => {
        return {
          ...room,
          participantsInfo: room.participantsInfo.filter(
            (info: DocumentData) => info.userId !== authUserId
          ),
        };
      })
    : [];

  return (
    <Container>
      <Header title="메시지" />
      <DirectListWrapper>
        {roomsWithContactInfo.map((room: DocumentData) => {
          return <DirectListItem key={room.id} room={room}></DirectListItem>;
        })}
      </DirectListWrapper>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const DirectListWrapper = styled.div`
  padding: 100px 0;
`;

export default DirectList;
