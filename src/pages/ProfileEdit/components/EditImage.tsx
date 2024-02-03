import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faArrowRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { DocumentData } from "firebase/firestore";
import { ImageUpload, imageReset } from "../../../api/userApi";

interface Props {
  authUser: DocumentData | undefined;
  setAuthUser: (user: DocumentData | undefined) => void;
}

const EditImage: React.FC<Props> = ({ authUser, setAuthUser }) => {
  const [profileImgFile, setProfileImgFile] = useState<File | null>(null);
  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [coverImagePreview, setCoverImagePreview] = useState<string>("");

  function profileImgChange(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files) {
      setProfileImgFile(files[0]);
      setProfileImagePreview(URL.createObjectURL(files[0]));
    }

    e.target.value = "";
  }

  function coverImgChange(e: ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (files) {
      setCoverImgFile(files[0]);
      setCoverImagePreview(URL.createObjectURL(files[0]));
    }

    e.target.value = "";
  }

  const imageUploadMutation = useMutation({
    mutationFn: async (files: {
      profileImgFile: File | null;
      coverImgFile: File | null;
    }) => {
      const updatedUser = await ImageUpload(files);
      setAuthUser(updatedUser);
    },
  });

  function handleUpload() {
    const updateFile = {
      profileImgFile,
      coverImgFile,
    };
    imageUploadMutation.mutate(updateFile, {
      onSuccess: () => {
        setProfileImagePreview("");
        setCoverImagePreview("");
        alert("정상적으로 변경되었습니다.");
      },
    });
  }

  const imageResetMutation = useMutation({
    mutationFn: async () => {
      if (authUser) {
        const { profileImage, coverImage } = authUser;
        const updatedUser = await imageReset(profileImage, coverImage);
        setAuthUser(updatedUser);
      }
    },
  });

  function handleReset() {
    const result = confirm("기본 프로필로 변경됩니다. 진행하시겠습니까?");
    if (result) {
      imageResetMutation.mutate();
    }
  }

  return (
    <Container
      $selected={coverImagePreview ? coverImagePreview : authUser?.coverImage}
    >
      {(coverImagePreview || authUser?.coverImage) && <BlackBackground />}
      {(authUser?.profileImage || authUser?.coverImage) && (
        <ResetIcon
          icon={faArrowRotateLeft}
          onClick={handleReset}
          $isExisted={authUser?.coverImage || coverImagePreview}
        />
      )}
      <ProfileImgWrapper
        $selected={
          profileImagePreview ? profileImagePreview : authUser?.profileImage
        }
      >
        {!authUser?.profileImage && !profileImagePreview && (
          <ProfileIcon icon={faCircleUser} />
        )}
      </ProfileImgWrapper>
      <ProfileImgEditBtn>
        <CameraIcon icon={faCamera} />
        <FileInputLabel htmlFor="profileImgUpload"></FileInputLabel>
        <FileInput
          id="profileImgUpload"
          type="file"
          onChange={profileImgChange}
        ></FileInput>
      </ProfileImgEditBtn>
      <CoverImgEditBtn>
        <CameraIcon icon={faCamera} />
        <FileInputLabel htmlFor="coverImgUpload"></FileInputLabel>
        <FileInput
          id="coverImgUpload"
          type="file"
          onChange={coverImgChange}
        ></FileInput>
      </CoverImgEditBtn>
      {(profileImagePreview || coverImagePreview) &&
        (imageUploadMutation.isPending ? (
          <LoadingWrapper>
            <SpinnerIcon
              icon={faSpinner}
              $isExisted={authUser?.coverImage || coverImagePreview}
              spinPulse
            />
          </LoadingWrapper>
        ) : (
          <BtnWrapper $isExisted={authUser?.coverImage || coverImagePreview}>
            <CancelBtn
              onClick={() => {
                setProfileImgFile(null);
                setCoverImgFile(null);
                setProfileImagePreview("");
                setCoverImagePreview("");
              }}
            >
              취소
            </CancelBtn>
            <SaverBtn onClick={handleUpload}>저장</SaverBtn>
          </BtnWrapper>
        ))}
    </Container>
  );
};

const Container = styled.div<{ $selected: string | null }>`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  height: 440px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  background-image: ${({ $selected }) =>
    $selected ? `url(${$selected})` : ""};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: rgba(1, 1, 1, 0.1);
`;

const BlackBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("");
  background-color: rgba(1, 1, 1, 0.5);
`;

const ResetIcon = styled(FontAwesomeIcon)<{ $isExisted: string }>`
  position: absolute;
  top: 24px;
  left: 24px;
  color: ${({ $isExisted }) => ($isExisted !== "" ? "#fff" : "#222")};
  font-size: 24px;

  &:hover {
    cursor: pointer;
  }
`;

const ProfileImgWrapper = styled.div<{ $selected: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100px;
  height: 100px;
  border: 4px solid #fff;
  border-radius: 50%;
  background-image: ${({ $selected }) =>
    $selected ? `url(${$selected})` : ""};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #fff;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  position: absolute;
  color: rgba(1, 1, 1, 0.2);
  font-size: 90px;
`;

const ProfileImgEditBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 42px;
  right: 190px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #fff;
`;

const CameraIcon = styled(FontAwesomeIcon)``;

const FileInputLabel = styled.label`
  position: absolute;
  inset: 0;

  &:hover {
    cursor: pointer;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const CoverImgEditBtn = styled(ProfileImgEditBtn)`
  top: 24px;
  right: 24px;
`;

const BtnWrapper = styled.div<{ $isExisted: string }>`
  display: flex;
  gap: 20px;
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: ${({ $isExisted }) => ($isExisted !== "" ? "#fff" : "#222")};
`;

const CancelBtn = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const SaverBtn = styled.div`
  &:hover {
    cursor: pointer;
  }
`;

const LoadingWrapper = styled.div`
  position: absolute;
  bottom: 10px;
  right: 30px;
  height: 48px;
  margin-top: 26px;
  margin-bottom: 10px;
  text-align: center;
`;

const SpinnerIcon = styled(FontAwesomeIcon)<{ $isExisted: string }>`
  color: ${({ $isExisted }) => ($isExisted !== "" ? "#fff" : "#222")};
  font-size: 40px;
`;

export default EditImage;
