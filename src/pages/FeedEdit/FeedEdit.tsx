import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import { editFeed, getFeed } from "../../api/postApi";

const GENDER = [
  { id: 1, gender: "man", text: "남성" },
  { id: 2, gender: "woman", text: "여성" },
];

const STYLE = [
  { id: 1, style: "romantic", text: "로맨틱" },
  { id: 2, style: "modern", text: "모던" },
  { id: 3, style: "minimal", text: "미니멀" },
  { id: 4, style: "vintage", text: "빈티지" },
  { id: 5, style: "street", text: "스트릿" },
  { id: 6, style: "sporty", text: "스포티" },
  { id: 7, style: "amecazi", text: "아메카지" },
  { id: 8, style: "casual", text: "캐주얼" },
  { id: 9, style: "classic", text: "클래식" },
];

const initialValue = {
  content: "",
  gender: "",
  style: "",
};
function FeedEdit() {
  const navigate = useNavigate();
  const [postValue, setPostValue] = useState(initialValue);
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [previewUrlList, setPreviewUrlList] = useState<string[]>([]);
  const { postId } = useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["feedEdit", postId],
    queryFn: () => getFeed(postId),
  });

  useEffect(() => {
    if (data) {
      const postData = {
        content: data.content,
        gender: data.gender,
        style: data.style,
      };
      setPostValue(postData);
      setPreviewUrlList(data.feedImages);
    }
  }, [data]);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setPostValue({ ...postValue, [name]: value });
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const maxImageCount = 3;
    const { files } = e.target;

    if (files) {
      if (files.length > maxImageCount) {
        alert("최대 3개의 이미지만 업로드 할 수 있습니다.");
        return;
      }

      const fileList = Array.from(files);
      const urlList = fileList.map((file) => URL.createObjectURL(file));
      setPreviewUrlList(urlList);
      setImageFileList(fileList);
    }

    e.target.value = "";
  }

  function handleRemove(removeIndex: number) {
    const removedFileList = imageFileList.filter(
      (_, index) => removeIndex !== index
    );
    const removedUrlList = previewUrlList.filter(
      (_, index) => removeIndex !== index
    );
    setImageFileList(removedFileList);
    setPreviewUrlList(removedUrlList);
  }

  const feedEditMutation = useMutation({
    mutationFn: async () => {
      const postData = {
        ...postValue,
        imageFiles: imageFileList,
        preImagesCount: data?.feedImages.length,
      };
      const updatedFeed = await editFeed(postId, postData);
      return updatedFeed;
    },
    onSuccess: (updatedFeed) => {
      queryClient.setQueryData(["feed", postId], updatedFeed);
      navigate(`/feeds/${postId}`, { replace: true });
      window.scrollTo(0, 0);
    },
  });

  const handleEdit = () => {
    feedEditMutation.mutate();
  };

  return (
    <Container>
      <Header title="게시물 수정" />
      <ContentBox>
        <UploadBox>
          <UploadWrapper>
            <ImageUploadIcon icon={faImages} />
            <UploadTitle>OOTD {">"}</UploadTitle>
            <UploadDescription>
              나만의 개성이 담긴
              <br />
              데일리룩을 올려보세요
            </UploadDescription>
            <FileInputLabel htmlFor="imageUpload"></FileInputLabel>
            <FileInput
              id="imageUpload"
              type="file"
              onChange={handleFileChange}
              multiple
            />
          </UploadWrapper>
          <UploadWrapper>
            <VideoUploadIcon icon={faVideo} />
            <UploadTitle> SHORT FORM {">"}</UploadTitle>
            <UploadDescription>
              지금 보여주고 싶은 <br />
              스타일 영상을 공유하세요
            </UploadDescription>
          </UploadWrapper>
        </UploadBox>
        <Guide>
          OOTD는 <Emphasis>최대 3장</Emphasis>까지 업로드 가능
        </Guide>
        <PreviewBox>
          {previewUrlList.map((url, index) => {
            return (
              <ImageWrapper key={url}>
                {imageFileList.length !== 0 && (
                  <RemoveBtn
                    onClick={() => {
                      handleRemove(index);
                    }}
                  >
                    ✕
                  </RemoveBtn>
                )}
                <PreviewImage src={url} />
              </ImageWrapper>
            );
          })}
        </PreviewBox>
        <PostContent
          name="content"
          placeholder="스타일을 자랑해보세요..."
          onChange={handleChange}
          value={postValue.content}
        ></PostContent>
        <SelectTitle>성별</SelectTitle>
        <SelectList>
          {GENDER.map((el) => {
            return (
              <SelectItem
                key={el.id}
                $isSelected={postValue.gender === el.gender}
                onClick={() => {
                  setPostValue({ ...postValue, gender: el.gender });
                }}
              >
                {postValue.gender === el.gender && (
                  <CheckIcon icon={faCircleCheck} />
                )}
                {el.text}
              </SelectItem>
            );
          })}
        </SelectList>
        <SelectTitle>스타일</SelectTitle>
        <SelectList>
          {STYLE.map((el) => {
            return (
              <SelectItem
                key={el.id}
                $isSelected={postValue.style === el.style}
                onClick={() => {
                  setPostValue({ ...postValue, style: el.style });
                }}
              >
                {postValue.style === el.style && (
                  <CheckIcon icon={faCircleCheck} />
                )}
                {el.text}
              </SelectItem>
            );
          })}
        </SelectList>
        {feedEditMutation.isPending ? (
          <LoadingWrapper>
            <SpinnerIcon icon={faSpinner} spinPulse />
          </LoadingWrapper>
        ) : (
          <UploadBtn
            onClick={() => {
              handleEdit();
            }}
          >
            수정하기
          </UploadBtn>
        )}
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding: 160px 30px;
  background-color: #fff;
`;

const UploadBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 60px;
`;

const UploadWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-basis: 200px;
  height: 250px;
  border-radius: 10px;
  background-color: rgba(1, 1, 1, 0.1);
`;

const ImageUploadIcon = styled(FontAwesomeIcon)`
  font-size: 54px;
  color: rgba(1, 1, 1, 0.6);
`;

const VideoUploadIcon = styled(FontAwesomeIcon)`
  font-size: 54px;
  color: rgba(1, 1, 1, 0.6);
`;

const UploadTitle = styled.div`
  font-weight: 700;
`;

const UploadDescription = styled.div`
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  text-align: center;
  line-height: 1.3;
`;

const FileInputLabel = styled.label`
  position: absolute;
  inset: 0;
  border-radius: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Guide = styled.div`
  margin-bottom: 40px;
  color: rgba(1, 1, 1, 0.7);
  text-align: center;
`;

const Emphasis = styled.span`
  color: rgba(1, 1, 1, 1);
  font-weight: 700;
`;

const PreviewBox = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 50px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const RemoveBtn = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  padding-bottom: 1px;
  border-radius: 50%;
  background-color: #a2a2a3;
  color: #fff;
  font-size: 12px;

  &:hover {
    cursor: pointer;
  }
`;

const PreviewImage = styled.img`
  width: 130px;
  height: 150px;
  border-radius: 8px;
  object-fit: cover;
`;

const PostContent = styled.textarea`
  width: 100%;
  height: 180px;
  padding: 20px;
  margin-bottom: 50px;
  border-radius: 8px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  resize: none;
  outline: none;
  transition: 0.4s;

  &::placeholder {
    font-size: 14px;
    color: rgba(1, 1, 1, 0.3);
  }

  &:focus {
    border: 1px solid rgba(1, 1, 1, 0.9);
  }
`;

const SelectTitle = styled.div`
  position: relative;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 18px;
`;

const SelectList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 50px;
`;

const SelectItem = styled.li<{ $isSelected: boolean }>`
  padding: 8px 12px;
  border: ${({ $isSelected }) =>
    $isSelected
      ? "1px solid rgba(1, 1, 1, 0.9)"
      : "1px solid rgba(1, 1, 1, 0.3)"};
  border-radius: 8px;
  color: ${({ $isSelected }) =>
    $isSelected ? "rgba(1, 1, 1, 0.9)" : "rgba(1, 1, 1, 0.4)"};
  font-size: 12px;
  font-weight: 500;
  transition: 0.4s;

  &:hover {
    cursor: pointer;
  }
`;

const CheckIcon = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

const UploadBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background-color: rgba(1, 1, 1, 0.9);
  color: #fff;
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background-color: rgba(1, 1, 1, 0.9);
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 28px;
`;

export default FeedEdit;
