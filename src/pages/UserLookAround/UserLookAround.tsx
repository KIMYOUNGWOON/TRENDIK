import { useContext } from "react";
import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/api";
import Header from "../../components/Header";
import UserListItem from "./components/UserListItem";
import UserContext from "../../contexts/UserContext";

function UserLookAround() {
  const { authUser } = useContext(UserContext);

  const result = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      if (authUser) {
        return await getUsers(authUser.userId);
      }
    },
    enabled: !!authUser,
  });

  const users = result.data ? result.data : [];

  return (
    <Container>
      <Header title="사용자 둘러보기" />
      <ContentBox>
        <SearchBarBox>
          <SearchIcon icon={faMagnifyingGlass} />
          <SearchInput type="text" placeholder="검색" />
        </SearchBarBox>
        <UserListBox>
          {users.map((user) => {
            return <UserListItem key={user.userId} user={user} />;
          })}
        </UserListBox>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 40px;
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding: 90px 30px 140px;
  background-color: #fff;
`;

const SearchBarBox = styled.div`
  position: relative;
  margin-bottom: 30px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 18px;
  color: rgba(1, 1, 1, 0.4);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 40px;
  border-radius: 8px;
  border: none;
  background-color: rgba(1, 1, 1, 0.1);
  color: rgba(1, 1, 1, 0.6);
  font-size: 16px;
  outline: none;
`;

const UserListBox = styled.div``;

export default UserLookAround;
