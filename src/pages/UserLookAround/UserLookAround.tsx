import { ChangeEvent, useContext, useState } from "react";
import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../api/userApi";
import Header from "../../components/Header";
import UserListItem from "./components/UserListItem";
import UserContext from "../../contexts/UserContext";
import { searchingUsers } from "../../api/searchApi";
import { useDebouncedMutation } from "../../hooks/useDebouncedMutation";

function UserLookAround() {
  const { authUserId } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading: usersLoading } = useQuery({
    queryKey: ["users", authUserId],
    queryFn: getUsers,
  });

  const userSearchMutation = useDebouncedMutation(async (value: string) => {
    const filteredUsers = await searchingUsers(value);
    queryClient.setQueryData(["users", authUserId], filteredUsers);
  });

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputValue(value);
    userSearchMutation.mutate(value);
  }

  const users = Array.isArray(data) ? data : [];

  return (
    <Container>
      <Header title="사용자 둘러보기" />
      <ContentBox>
        <SearchBarBox>
          <SearchIcon icon={faMagnifyingGlass} />
          <SearchInput
            type="text"
            placeholder="닉네임 검색"
            value={inputValue}
            onChange={handleChange}
          />
        </SearchBarBox>
        {users.length === 0 && !usersLoading ? (
          <UserSearchEmpty>
            <EmptyText>검색된 사용자가 없습니다.</EmptyText>
            <ReTryText>다른 닉네임으로 검색해주세요.</ReTryText>
          </UserSearchEmpty>
        ) : (
          <UserListBox>
            {users.map((user) => {
              return (
                <UserListItem
                  key={user.userId}
                  user={user}
                  usersLoading={usersLoading}
                  authUserId={authUserId}
                />
              );
            })}
          </UserListBox>
        )}
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding: 140px 30px 100px;
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
  color: rgba(1, 1, 1, 0.3);
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 50px;
  border-radius: 8px;
  border: none;
  background-color: rgba(1, 1, 1, 0.1);
  color: rgba(1, 1, 1, 0.6);
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
    font-size: 14px;
  }
`;

const UserListBox = styled.div``;

const UserSearchEmpty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 40%;
`;

const EmptyText = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 14px;
`;

const ReTryText = styled.div`
  color: rgba(1, 1, 1, 0.5);
  font-size: 14px;
`;

export default UserLookAround;
