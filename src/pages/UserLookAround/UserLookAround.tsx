import { ChangeEvent, useContext, useState } from "react";
import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/userApi";
import Header from "../../components/Header";
import UserListItem from "./components/UserListItem";
import UserContext from "../../contexts/UserContext";

function UserLookAround() {
  const { authUser } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  const { data } = useQuery({
    queryKey: ["users", authUser.userId],
    queryFn: getUsers,
  });

  const userList = Array.isArray(data) ? data : [];

  return (
    <Container>
      <Header title="사용자 둘러보기" />
      <ContentBox>
        <SearchBarBox>
          <SearchIcon icon={faMagnifyingGlass} />
          <SearchInput
            type="text"
            placeholder="검색"
            value={inputValue}
            onChange={handleChange}
          />
        </SearchBarBox>
        <UserListBox>
          {userList.map((user) => {
            return <UserListItem key={user.userId} user={user} />;
          })}
        </UserListBox>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding: 140px 30px 0;
  background-color: #fff;
`;

const SearchBarBox = styled.div`
  position: relative;
  margin-bottom: 30px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  left: 18px;
  font-size: 18px;
  color: rgba(1, 1, 1, 0.4);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 50px;
  border-radius: 8px;
  border: none;
  background-color: rgba(1, 1, 1, 0.1);
  color: rgba(1, 1, 1, 0.6);
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
  }
`;

const UserListBox = styled.div``;

export default UserLookAround;
