import { useContext, useState } from "react";
import styled from "styled-components";
import Header from "../../components/Header";
import { componentMount } from "../../styles/Animation";
import UserContext from "../../contexts/UserContext";
import ProfileEditModal from "./components/ProfileEditModal";
import EditImage from "./components/EditImage";

function ProfileEdit() {
  const { authUser, setAuthUser } = useContext(UserContext);
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
      <Header title="프로필 설정" />
      <ContentBox>
        <EditImage
          profileImage={authUser?.profileImage}
          coverImage={authUser?.coverImage}
          setAuthUser={setAuthUser}
        />
        <ProfileInfoBox>
          <InputWrapper>
            <Label>닉네임</Label>
            <Input value={authUser?.nickName || ""} disabled />
            <NickNameEditBtn
              onClick={() => {
                editModalOpen("nickName");
              }}
            >
              변경
            </NickNameEditBtn>
          </InputWrapper>
          <InputWrapper>
            <Label>소개</Label>
            <TextArea value={authUser?.bio || ""} disabled></TextArea>
            <BioEditBtn
              onClick={() => {
                editModalOpen("bio");
              }}
            >
              변경
            </BioEditBtn>
          </InputWrapper>
        </ProfileInfoBox>
        {modalStatus && <ModalBackground onClick={editModalClose} />}
        {modalStatus && (
          <ProfileEditModal
            selected={selected}
            editModalClose={editModalClose}
            nickName={authUser?.nickName}
            bio={authUser?.bio}
            setAuthUser={setAuthUser}
          />
        )}
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  padding: 40px 0 100px;
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  position: relative;
  padding-top: 60px;
`;

const ProfileInfoBox = styled.form`
  padding: 0 40px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 50px;
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

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 150px;
  padding: 20px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  resize: none;
  outline: none;
`;

const NickNameEditBtn = styled.div`
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

const BioEditBtn = styled(NickNameEditBtn)`
  top: 136px;
  right: 14px;
`;

const ModalBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.5);
`;

export default ProfileEdit;
