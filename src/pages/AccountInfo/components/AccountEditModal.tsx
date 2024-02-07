import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auth, db } from "../../../firebase";
import { getUser } from "../../../api/userApi";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { passwordRegex } from "../../../validation";
import { updatePassword } from "firebase/auth";

interface Props {
  isOpened: boolean;
  selected: string;
  name: string;
  editModalClose: () => void;
}

const AccountEditModal: React.FC<Props> = ({
  isOpened,
  selected,
  name,
  editModalClose,
}) => {
  const [nameValue, setNameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState({
    password: "",
    passwordConfirm: "",
  });
  const nameDiff = name !== nameValue;
  const passwordCheck =
    !passwordValue.password || passwordRegex.test(passwordValue.password);
  const passwordMatch =
    !passwordValue.passwordConfirm ||
    passwordValue.password === passwordValue.passwordConfirm;
  const isValidate = passwordCheck && passwordMatch;
  const queryClient = useQueryClient();

  useEffect(() => {
    setNameValue(name);
  }, [name]);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setNameValue(value);
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setPasswordValue({ ...passwordValue, [name]: value });
  }

  const nameEditMutation = useMutation({
    mutationFn: async (name: string) => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          await updateDoc(userRef, { name });
          const updatedUser = await getUser(user.uid);
          return updatedUser;
        }
      } catch (e) {
        console.log(e);
      }
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["authUser"], updatedUser);
      alert("정상적으로 변경되었습니다.");
      editModalClose();
    },
  });

  async function editName() {
    nameEditMutation.mutate(nameValue);
  }

  const passwordEditMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      try {
        const user = auth.currentUser;
        if (user) {
          await updatePassword(user, newPassword);
        }
      } catch (e) {
        console.log(e);
      }
    },
  });

  async function editPassword() {
    passwordEditMutation.mutate(passwordValue.password, {
      onSuccess: () => {
        alert("정상적으로 변경되었습니다.");
        editModalClose();
      },
    });
  }

  return (
    <Container $isOpened={isOpened}>
      <Header>
        <Title>{selected === "password" ? "비밀번호" : "이름"} 변경</Title>
        <CancelBtn onClick={editModalClose}>취소</CancelBtn>
      </Header>
      {selected === "name" && (
        <InputWrapper>
          <Label>이름</Label>
          <Input value={nameValue} onChange={handleNameChange} />
        </InputWrapper>
      )}
      {selected === "password" && (
        <Form>
          <InputWrapper>
            <Label>비밀번호</Label>
            <Input
              type="password"
              name="password"
              autoComplete="off"
              placeholder="새 비밀번호 입력"
              value={passwordValue.password}
              onChange={handlePasswordChange}
            />
            {!passwordCheck && (
              <ErrorMessage>
                비밀번호 양식을 확인해주세요. (ex. 8자 이상 / 영문, 숫자,
                특수문자 포함)
              </ErrorMessage>
            )}
          </InputWrapper>
          <InputWrapper>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              name="passwordConfirm"
              autoComplete="off"
              placeholder="새 비밀번호 한 번 더 입력"
              value={passwordValue.passwordConfirm}
              onChange={handlePasswordChange}
            />
            {!passwordMatch && (
              <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
            )}
          </InputWrapper>
        </Form>
      )}
      {selected === "password" ? (
        passwordEditMutation.isPending ? (
          <LoadingSpinner />
        ) : (
          <SavePassword
            $isValidate={isValidate}
            onClick={() => {
              if (isValidate) {
                editPassword();
              }
            }}
          >
            저장하기
          </SavePassword>
        )
      ) : nameEditMutation.isPending ? (
        <LoadingSpinner />
      ) : (
        <SaveName
          $diff={nameDiff}
          onClick={() => {
            if (nameDiff) {
              editName();
            }
          }}
        >
          저장하기
        </SaveName>
      )}
    </Container>
  );
};

const Container = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  left: 50%;
  right: 0;
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
  padding: 30px 0;
  margin-bottom: 20px;
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

const Form = styled.form``;

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
  margin-bottom: 10px;
  padding: 0 60px 0 16px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  color: #494949;
  outline: none;
  transition: 0.4s;
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

const SaveName = styled(SaveButton)<{ $diff: boolean }>`
  background-color: ${({ $diff }) => ($diff ? "#222" : "rgba(0, 0, 0, 0.1)")};
`;

const SavePassword = styled(SaveButton)<{ $isValidate: boolean }>`
  background-color: ${({ $isValidate }) =>
    $isValidate ? "#222" : "rgba(0, 0, 0, 0.1)"};
`;

const ErrorMessage = styled.div`
  color: #f50100;
  font-size: 12px;
`;

export default AccountEditModal;
