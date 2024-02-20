import styled from "styled-components";
import Header from "../../components/Header";
import { componentMount } from "../../styles/Animation";
import { useNavigate, useParams } from "react-router-dom";
import { ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getFollowers, getFollowings } from "../../api/connectApi";
import { getUser } from "../../api/userApi";
import FollowUserListItem from "./components/FollowUserListItem";
import { useDebouncedMutation } from "../../hooks/useDebouncedMutation";
import { searchingFollowerFollowing } from "../../api/searchApi";
import SortChangeModal from "./components/SortChangeModal";

interface sortPareType {
  [key: string]: string;
}

const sortPare: sortPareType = {
  basics: "기본",
  asc: "팔로우한 날짜: 오래된순",
  desc: "팔로우한 날짜: 최신순",
};

function FollowerFollowing() {
  const { userId, select } = useParams();
  const [inputValue, setInputValue] = useState("");
  const [sort, setSort] = useState("basics");
  const [sortChangeModal, setSortChangeModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["users", userId],
    queryFn: () => {
      if (userId) {
        return getUser(userId);
      }
    },
    enabled: !!userId,
  });

  const queryKey =
    select === "follower" ? [select, userId] : [select, userId, sort];

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (select === "following") {
        return await getFollowings(userId, sort);
      } else {
        return await getFollowers(userId);
      }
    },
  });

  const userSearchMutation = useDebouncedMutation(async (value: string) => {
    const filteredUsers = await searchingFollowerFollowing(
      select,
      userId,
      value,
      sort
    );
    if (select === "follower") {
      queryClient.setQueryData([select, userId], filteredUsers);
    } else {
      queryClient.setQueryData([select, userId, sort], filteredUsers);
    }
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    userSearchMutation.mutate(value);
    setInputValue(value);
  }

  function handleSortChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setSort(value);
    toggleSortChangeModal();
  }

  function toggleSortChangeModal() {
    setSortChangeModal((prev) => !prev);
  }

  return (
    <Container>
      <Header title={user?.nickName} />
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
        <SelectBox>
          <FollowerBtn
            $selected={select}
            onClick={() => {
              navigate(`/users/${userId}/follower`, { replace: true });
              setInputValue("");
            }}
          >
            팔로워
          </FollowerBtn>
          <FollowingBtn
            $selected={select}
            onClick={() => {
              navigate(`/users/${userId}/following`, { replace: true });
              setInputValue("");
            }}
          >
            팔로잉
          </FollowingBtn>
        </SelectBox>
        {select === "following" && users?.length !== 0 && (
          <SortBox>
            <SortMarkKey>
              정렬 기준 : <SortMarkValue>{sortPare[sort]}</SortMarkValue>
            </SortMarkKey>
            <SortChangeBtn onClick={toggleSortChangeModal}>↓↑</SortChangeBtn>
          </SortBox>
        )}
        {users?.length === 0 ? (
          <EmptyBox>
            <EmptyText>
              {select === "follower"
                ? "팔로워가 없습니다."
                : "팔로잉이 없습니다."}
            </EmptyText>
          </EmptyBox>
        ) : (
          <UserListBox>
            {users?.map((user) => {
              if (user) {
                return (
                  <FollowUserListItem
                    key={user.userId}
                    user={user}
                    usersLoading={usersLoading}
                  />
                );
              }
            })}
          </UserListBox>
        )}
      </ContentBox>
      {sortChangeModal && <BackGround onClick={toggleSortChangeModal} />}
      <SortChangeModal
        sort={sort}
        sortChangeModal={sortChangeModal}
        handleSortChange={handleSortChange}
        toggleSortChangeModal={toggleSortChangeModal}
      />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
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
  top: 12px;
  left: 50px;
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
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: rgba(1, 1, 1, 0.4);
  }
`;

const SelectBox = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(1, 1, 1, 0.2);
  margin-bottom: 20px;
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

const SortBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
`;

const SortMarkKey = styled.div`
  color: rgba(1, 1, 1, 0.5);
`;

const SortMarkValue = styled.span`
  color: rgba(1, 1, 1, 0.9);
  font-weight: 600;
`;

const SortChangeBtn = styled.div`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -6px;
  &:hover {
    cursor: pointer;
  }
`;

const BackGround = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.4);
`;

const EmptyBox = styled.div`
  padding-top: 30%;
`;

const EmptyText = styled.div`
  font-size: 18px;
  font-weight: 500;
  text-align: center;
`;

export default FollowerFollowing;
