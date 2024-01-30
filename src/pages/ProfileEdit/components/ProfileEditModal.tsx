import styled from "styled-components";
import { editModalOpen } from "../../../styles/Animation";
import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { checkNickName, updateProfile } from "../../../api/api";
import { auth } from "../../../firebase";
import { DocumentData } from "firebase/firestore";
import LoadingSpinner from "../../../components/LoadingSpinner";

interface Props {
  selected: string;
  editModalClose: () => void;
  nickName: string;
  bio: string;
  setAuthUser: (value: React.SetStateAction<DocumentData | undefined>) => void;
}

const ProfileEditModal: React.FC<Props> = ({
  selected,
  editModalClose,
  nickName,
  bio,
  setAuthUser,
}) => {
  const initialValue = {
    nickName,
    bio,
  };
  const [inputValue, setInputValue] = useState(initialValue);
  const nickNameDiff = nickName !== inputValue.nickName;
  const bioDiff = bio !== inputValue.bio;

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
      if (updatedUser) {
        setAuthUser(updatedUser);
      }
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
      nickNameEditMutation.mutate(updateData, {
        onSuccess: () => {
          alert("정상적으로 변경되었습니다.");
          editModalClose();
        },
      });
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
      if (updatedUser) {
        setAuthUser(updatedUser);
      }
    },
  });

  function saveBio() {
    const user = auth.currentUser;
    const updateData = {
      userId: user?.uid,
      key: "bio",
      value: inputValue.bio,
    };
    bioEditMutation.mutate(updateData, {
      onSuccess: () => {
        alert("정상적으로 변경되었습니다.");
        editModalClose();
      },
    });
  }

  return (
    <Container>
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

const Container = styled.div`
  position: fixed;
  left: 50%;
  right: 0;
  bottom: 70px;
  width: 500px;
  height: 410px;
  padding: 30px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transform: translateX(-50%);
  animation: ${editModalOpen} 0.2s linear;
`;

const Header = styled.div`
  position: relative;
  margin-bottom: 40px;
`;

const Title = styled.div`
  font-weight: 500;
  text-align: center;
`;

const CancelBtn = styled.div`
  position: absolute;
  top: 0;
  right: 10px;

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
  margin-bottom: 10px;
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
  height: 40px;
  padding: 0 60px 0 16px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  color: #494949;
  outline: none;
  transition: 0.4s;
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
  height: 40px;
  border-radius: 20px;
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
