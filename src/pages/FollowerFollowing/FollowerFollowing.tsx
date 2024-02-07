import styled from "styled-components";
import Header from "../../components/Header";
import { componentMount } from "../../styles/Animation";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@tanstack/react-query";
import { getFollowers, getFollowings } from "../../api/connectApi";
import UserListItem from "../UserLookAround/components/UserListItem";
import { getUser } from "../../api/userApi";

function FollowerFollowing() {
  const { userId, select } = useParams();
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setInputValue(value);
  }

  const { data: user } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => {
      if (userId) {
        return getUser(userId);
      }
    },
    enabled: !!userId,
  });

  const queryFn = select === "follower" ? getFollowers : getFollowings;

  const { data } = useQuery({
    queryKey: [select, userId],
    queryFn: async () => await queryFn(userId),
  });

  const userList = Array.isArray(data) ? data : [];

  return (
    <Container>
      <Header title={user?.nickName} />
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
        <SelectBox>
          <FollowerBtn
            $selected={select}
            onClick={() => {
              navigate(`/users/${userId}/follower`, { replace: true });
            }}
          >
            팔로워
          </FollowerBtn>
          <FollowingBtn
            $selected={select}
            onClick={() => {
              navigate(`/users/${userId}/following`, { replace: true });
            }}
          >
            팔로잉
          </FollowingBtn>
        </SelectBox>
        <UserListBox>
          {userList.map((user) => {
            return user ? <UserListItem key={user.userId} user={user} /> : null;
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
  padding-top: 140px;
  background-color: #fff;
`;

const SearchBarBox = styled.div`
  position: relative;
  padding: 0 30px;
  margin-bottom: 40px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  left: 50px;
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
    color: rgba(1, 1, 1, 0.4);
  }
`;

const SelectBox = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(1, 1, 1, 0.2);
`;

const FollowerBtn = styled.div<{ $selected: string | undefined }>`
  flex: 1;
  text-align: center;
  padding-bottom: 24px;
  border-bottom: ${({ $selected }) =>
    $selected === "follower" ? "2px solid #222" : "none"};
  color: ${({ $selected }) =>
    $selected === "follower" ? "#222" : "rgba(1,1,1,0.3)"};

  &:hover {
    cursor: pointer;
  }
`;

const FollowingBtn = styled(FollowerBtn)`
  border-bottom: ${({ $selected }) =>
    $selected === "following" ? "2px solid #222" : "none"};
  color: ${({ $selected }) =>
    $selected === "following" ? "#222" : "rgba(1,1,1,0.3)"};
`;

const UserListBox = styled.div`
  padding: 30px;
`;

export default FollowerFollowing;
