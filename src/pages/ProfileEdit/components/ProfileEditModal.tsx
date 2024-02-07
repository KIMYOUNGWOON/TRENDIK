import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkNickName, updateProfile } from "../../../api/userApi";
import { auth } from "../../../firebase";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { nickNameRegex } from "../../../validation";

interface Props {
  isOpened: boolean;
  selected: string;
  editModalClose: () => void;
  nickName: string;
  bio: string;
}

const ProfileEditModal: React.FC<Props> = ({
  isOpened,
  selected,
  editModalClose,
  nickName,
  bio,
}) => {
  const initialValue = {
    nickName,
    bio,
  };
  const [inputValue, setInputValue] = useState(initialValue);
  const nickNameDiff = nickName !== inputValue.nickName;
  const bioDiff = bio !== inputValue.bio;
  const queryClient = useQueryClient();

  useEffect(() => {
    setInputValue({ nickName, bio });
  }, [nickName, bio]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setInputValue({ ...inputValue, [name]: value });
  }

  const nickNameEditMutation = useMutation({
    mutationFn: async (data: {
      userId: string | undefined;
      key: string;
      value: string | undefined;
    }) => {
      const updatedUser = await updateProfile(data);
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["authUser"], updatedUser);
      alert("정상적으로 변경되었습니다.");
      editModalClose();
    },
  });

  async function saveNickName() {
    const check = await checkNickName(inputValue.nickName);
    if (check) {
      const user = auth.currentUser;
      const updateData = {
        userId: user?.uid,
        key: "nickName",
        value: inputValue.nickName,
      };
      nickNameEditMutation.mutate(updateData);
    } else {
      alert("이미 사용 중인 닉네임입니다.");
    }
  }

  const bioEditMutation = useMutation({
    mutationFn: async (data: {
      userId: string | undefined;
      key: string;
      value: string | undefined;
    }) => {
      const updatedUser = await updateProfile(data);
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["authUser"], updatedUser);
      alert("정상적으로 변경되었습니다.");
      editModalClose();
    },
  });

  function saveBio() {
    const user = auth.currentUser;
    const updateData = {
      userId: user?.uid,
      key: "bio",
      value: inputValue.bio,
    };
    bioEditMutation.mutate(updateData);
  }

  const nickNameCheck =
    nickNameRegex.test(inputValue.nickName) || inputValue.nickName.length === 0;

  return (
    <Container $isOpened={isOpened}>
      <Header>
        <Title>{selected === "nickName" ? "닉네임" : "소개"} 변경</Title>
        <CancelBtn onClick={editModalClose}>취소</CancelBtn>
      </Header>
      {selected === "nickName" ? (
        <InputWrapper>
          <Label htmlFor="nickName">닉네임</Label>
          <Input
            id="nickName"
            name="nickName"
            autoComplete="off"
            value={inputValue.nickName}
            onChange={handleChange}
          />
          {!nickNameCheck && (
            <ErrorMessage>
              최소 5자 이상이며 "영문(소문자)", "_"만 사용 가능합니다
            </ErrorMessage>
          )}
        </InputWrapper>
      ) : (
        <InputWrapper>
          <Label htmlFor="bio">소개</Label>
          <TextArea
            id="bio"
            name="bio"
            autoComplete="off"
            value={inputValue.bio}
            onChange={handleChange}
          />
        </InputWrapper>
      )}
      {selected === "nickName" ? (
        nickNameEditMutation.isPending ? (
          <LoadingSpinner />
        ) : (
          <SaveNickName
            $diff={nickNameDiff}
            onClick={() => {
              if (nickNameDiff) {
                saveNickName();
              }
            }}
          >
            저장하기
          </SaveNickName>
        )
      ) : bioEditMutation.isPending ? (
        <LoadingSpinner />
      ) : (
        <SaveBio
          $diff={bioDiff}
          onClick={() => {
            if (bioDiff) {
              saveBio();
            }
          }}
        >
          저장하기
        </SaveBio>
      )}
    </Container>
  );
};

const Container = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 70px;
  width: 500px;
  height: ${({ $isOpened }) => ($isOpened ? "410px" : 0)};
  padding: 0 30px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transform: translateX(-50%);
  transition: 0.3s;
  overflow: hidden;
`;

const Header = styled.div`
  position: relative;
  padding: 30px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-weight: 500;
  text-align: center;
`;

const CancelBtn = styled.div`
  position: absolute;
  top: 30px;
  right: 0;

  &:hover {
    cursor: pointer;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 40px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 12px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  height: 44px;
  padding: 0 60px 0 16px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  color: #494949;
  outline: none;
  transition: 0.4s;
`;

const ErrorMessage = styled.div`
  color: #f50100;
  font-size: 12px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 150px;
  padding: 16px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  resize: none;
  outline: none;
`;

const SaveButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  background-color: #222;
  color: #fff;
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
`;

const SaveNickName = styled(SaveButton)<{ $diff: boolean }>`
  background-color: ${({ $diff }) =>
    $diff ? "rgba(1, 1, 1 , 0.8)" : "rgba(1, 1, 1 , 0.1)"};
`;

const SaveBio = styled(SaveButton)<{ $diff: boolean }>`
  background-color: ${({ $diff }) =>
    $diff ? "rgba(1, 1, 1 , 0.8)" : "rgba(1, 1, 1 , 0.1)"};
`;

export default ProfileEditModal;
