import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { DocumentData } from "firebase/firestore";
import { ImageUpload } from "../../../api/api";

interface Props {
  profileImage: string;
  coverImage: string;
  setAuthUser: (user: DocumentData | undefined) => void;
}

const EditImage: React.FC<Props> = ({
  profileImage,
  coverImage,
  setAuthUser,
}) => {
  const [profileImgFile, setProfileImgFile] = useState<File | null>(null);
  const [coverImgFile, setCoverImgFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    null
  );

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
        setProfileImagePreview(null);
        setCoverImagePreview(null);
        alert("정상적으로 변경되었습니다.");
      },
    });
  }

  return (
    <Container $selected={coverImagePreview ? coverImagePreview : coverImage}>
      {(coverImagePreview || coverImage) && <BlackBackground />}
      <ProfileImgWrapper
        $selected={profileImagePreview ? profileImagePreview : profileImage}
      >
        {!profileImage && !profileImagePreview && (
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
            <SpinnerIcon icon={faSpinner} spinPulse />
          </LoadingWrapper>
        ) : (
          <BtnWrapper>
            <CancelBtn
              onClick={() => {
                setProfileImgFile(null);
                setCoverImgFile(null);
                setProfileImagePreview(null);
                setCoverImagePreview(null);
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
  height: 300px;
  margin-bottom: 40px;
  padding-bottom: 40px;
  background-image: ${({ $selected }) =>
    $selected ? `url(${$selected})` : ""};
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-color: rgba(1, 1, 1, 0.2);
`;

const BlackBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url("");
  background-color: rgba(1, 1, 1, 0.5);
`;

const ProfileImgWrapper = styled.div<{ $selected: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 110px;
  height: 110px;
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
  color: rgba(1, 1, 1, 0.3);
  font-size: 100px;
`;

const ProfileImgEditBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 42px;
  right: 200px;
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

const BtnWrapper = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;
  bottom: 20px;
  right: 20px;
`;

const CancelBtn = styled.div`
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const SaverBtn = styled.div`
  color: #fff;

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

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 40px;
`;

export default EditImage;
