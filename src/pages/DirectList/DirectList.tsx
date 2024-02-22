import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import styled from "styled-components";
import UserContext from "../../contexts/UserContext";
import { getMessageRooms } from "../../api/directApi";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import DirectListItem from "./DirectListItem/DirectListItem";

function DirectList() {
  const { authUserId } = useContext(UserContext);

  const { data: messageRooms } = useQuery({
    queryKey: ["messageRooms", authUserId],
    queryFn: () => getMessageRooms(),
  });

  const rooms = messageRooms
    ? messageRooms.map((room) => {
        return {
          ...room,
          participants: room.participants.filter(
            (id: string) => id !== authUserId
          ),
        };
      })
    : [];

  console.log(rooms);

  return (
    <Container>
      <Header title="메시지" />
      <DirectListWrapper>
        <DirectListItem></DirectListItem>
      </DirectListWrapper>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const DirectListWrapper = styled.div``;

export default DirectList;
