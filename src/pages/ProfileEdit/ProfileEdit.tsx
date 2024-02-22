import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Header from "../../components/Header";
import { componentMount } from "../../styles/Animation";
import UserContext from "../../contexts/UserContext";
import EditImage from "./components/EditImage";
import { getUser } from "../../api/userApi";
import ProfileEditModal from "./components/ProfileEditModal";

function ProfileEdit() {
  const { authUserId } = useContext(UserContext);
  const [isOpened, setIsOpened] = useState(false);
  const [selected, setSelected] = useState("");

  const { data: authUser } = useQuery({
    queryKey: ["authUser", authUserId],
    queryFn: () => getUser(authUserId),
    enabled: !!authUserId,
  });

  function editModalOpen(target: string) {
    setIsOpened((prev) => !prev);
    setSelected(target);
  }

  function editModalClose() {
    setIsOpened((prev) => !prev);
  }

  if (!authUser) {
    return;
  }

  return (
    <Container>
      <Header title="프로필 설정" />
      <ContentBox>
        <EditImage authUser={authUser} />
        <ProfileInfoEditBox>
          <InputWrapper>
            <Label htmlFor="nickName">닉네임</Label>
            <Input id="nickName" value={authUser.nickName || ""} disabled />
            <EditBtn
              onClick={() => {
                editModalOpen("nickName");
              }}
            >
              변경
            </EditBtn>
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="gender">성별</Label>
            <Input id="gender" value={authUser.gender || ""} disabled />
            <EditBtn
              onClick={() => {
                editModalOpen("gender");
              }}
            >
              변경
            </EditBtn>
          </InputWrapper>
          <Wrapper>
            <InputWrapper>
              <Label htmlFor="height">키</Label>
              <Input id="height" value={authUser.height || 0} disabled />
              <EditBtn
                onClick={() => {
                  editModalOpen("height");
                }}
              >
                변경
              </EditBtn>
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="weight">몸무게</Label>
              <Input id="weight" value={authUser.weight || 0} disabled />
              <EditBtn
                onClick={() => {
                  editModalOpen("weight");
                }}
              >
                변경
              </EditBtn>
            </InputWrapper>
            <InputWrapper>
              <Label htmlFor="shoesSize">신발 사이즈</Label>
              <Input id="shoesSize" value={authUser.shoesSize || 0} disabled />
              <EditBtn
                onClick={() => {
                  editModalOpen("shoesSize");
                }}
              >
                변경
              </EditBtn>
            </InputWrapper>
          </Wrapper>
          <InputWrapper>
            <Label htmlFor="bio">소개</Label>
            <TextArea id="bio" value={authUser.bio || ""} disabled></TextArea>
            <BioEditBtn
              onClick={() => {
                editModalOpen("bio");
              }}
            >
              변경
            </BioEditBtn>
          </InputWrapper>
        </ProfileInfoEditBox>
        {isOpened && <ModalBackground onClick={editModalClose} />}
        <ProfileEditModal
          isOpened={isOpened}
          selected={selected}
          editModalClose={editModalClose}
          authUser={authUser}
        />
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
  overflow: hidden;
`;

const ContentBox = styled.div`
  position: relative;
  padding: 100px 0;
  background-color: #fff;
`;

const ProfileInfoEditBox = styled.div`
  padding: 0 40px;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 14px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 50px;
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

const EditBtn = styled.div`
  position: absolute;
  top: 37px;
  right: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: rgba(1, 1, 1, 0.2);
  color: #fff;
  font-size: 10px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background-color: rgba(1, 1, 1, 0.8);
  }
`;

const BioEditBtn = styled(EditBtn)`
  top: 138px;
  right: 16px;
`;

const ModalBackground = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.5);
`;

export default ProfileEdit;
