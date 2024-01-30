import { useContext, useState } from "react";
import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import UserContext from "../../contexts/UserContext";
import Header from "../../components/Header";
import AccountEditModal from "./components/AccountEditModal";

function AccountInfo() {
  const { user, setUser } = useContext(UserContext);
  const [modalStatus, setModalStatus] = useState(false);
  const [selected, setSelected] = useState("");

  function editModalOpen(target: string) {
    setModalStatus((prev) => !prev);
    setSelected(target);
  }

  function editModalClose() {
    setModalStatus((prev) => !prev);
  }

  return (
    <Container>
      <Header title="계정 정보" />
      <ContentBox>
        <JoinDate>가입일자 : 2024/01/24 18:26:06</JoinDate>
        <InputWrapper>
          <Label>이름</Label>
          <Input disabled value={user.name || ""} />
          <NamedEdit
            onClick={() => {
              editModalOpen("name");
            }}
          >
            변경
          </NamedEdit>
        </InputWrapper>
        <InputWrapper>
          <Label>이메일</Label>
          <Input disabled value={user.email || ""} />
        </InputWrapper>
        <InputWrapper>
          <Label>비밀번호</Label>
          <Input disabled />
          <PasswordEdit
            onClick={() => {
              editModalOpen("password");
            }}
          >
            변경
          </PasswordEdit>
        </InputWrapper>

        <DeleteAccount>회원탈퇴</DeleteAccount>
        {modalStatus && <ModalBackground onClick={editModalClose} />}
        {modalStatus && (
          <AccountEditModal
            selected={selected}
            editModalClose={editModalClose}
            setUser={setUser}
            name={user.name}
          />
        )}
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  padding: 40px 0 140px;
  animation: ${componentMount} 0.15s linear;
`;

const JoinDate = styled.div`
  margin-bottom: 30px;
  color: rgba(1, 1, 1, 0.5);
  font-size: 14px;
`;

const ContentBox = styled.div`
  position: relative;
  padding: 100px 40px 0;
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
  padding: 0 20px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  color: #494949;
  outline: none;
  transition: 0.4s;
`;

const EditButton = styled.div`
  position: absolute;
  top: 32px;
  right: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  background-color: rgba(1, 1, 1, 0.2);
  color: #fff;
  font-size: 12px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background-color: rgba(1, 1, 1, 0.8);
  }
`;

const PasswordEdit = styled(EditButton)``;

const NamedEdit = styled(EditButton)``;

const DeleteAccount = styled.div`
  color: #f50100;

  &:hover {
    cursor: pointer;
  }
`;

const ModalBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.5);
`;

export default AccountInfo;
