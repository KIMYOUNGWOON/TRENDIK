import { ChangeEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import { PostData } from "../../api/types";
import { uploadFeed } from "../../api/postApi";
import { resizeImage } from "../../utils/resizeFile";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  DropResult,
} from "react-beautiful-dnd";

const GENDER = [
  { id: 1, value: "남성" },
  { id: 2, value: "여성" },
];

const STYLE = [
  { id: 1, value: "로맨틱" },
  { id: 2, value: "모던" },
  { id: 3, value: "미니멀" },
  { id: 4, value: "빈티지" },
  { id: 5, value: "스트릿" },
  { id: 6, value: "스포티" },
  { id: 7, value: "아메카지" },
  { id: 8, value: "캐주얼" },
  { id: 9, value: "클래식" },
];

interface PostValue {
  hashTag: { id: number; hashTag: string }[];
  content: string;
  outer: string;
  top: string;
  bottom: string;
  shoes: string;
  gender: string;
  style: string;
}

const initialValue: PostValue = {
  hashTag: [],
  content: "",
  outer: "",
  top: "",
  bottom: "",
  shoes: "",
  gender: "",
  style: "",
};

const PostUpload = () => {
  const navigate = useNavigate();
  const [postValue, setPostValue] = useState<PostValue>(initialValue);
  const [hashTagValue, setHashTagValue] = useState("");
  const [imageFileList, setImageFileList] = useState<File[]>([]);
  const [previewUrlList, setPreviewUrlList] = useState<string[]>([]);
  const isChecked =
    Object.values(postValue).every((value) => Boolean(value)) &&
    imageFileList.length !== 0;

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setHashTagValue(value);
  }

  function addHashTag() {
    if (postValue.hashTag.length === 5) {
      alert("최대 5개까지만 추가할 수 있습니다.");
      setHashTagValue("");
      return;
    }
    setPostValue({
      ...postValue,
      hashTag: [
        ...postValue.hashTag,
        {
          id: (postValue.hashTag[postValue.hashTag.length - 1]?.id || 0) + 1,
          hashTag: hashTagValue,
        },
      ],
    });
    setHashTagValue("");
  }

  function removeHashTag(targetId: number) {
    setPostValue({
      ...postValue,
      hashTag: postValue.hashTag.filter((tag) => targetId !== tag.id),
    });
    setHashTagValue("");
  }

  function handleChange(
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setPostValue({ ...postValue, [name]: value });
  }

  async function handleImageFileChange(e: ChangeEvent<HTMLInputElement>) {
    const maxImageCount = 3;
    const { files } = e.target;

    if (files) {
      if (files.length > maxImageCount) {
        alert("최대 3개의 이미지만 업로드 할 수 있습니다.");
        return;
      }

      const fileList = Array.from(files);
      const resizedFileList = await Promise.all(fileList.map(resizeImage));
      const urlList = resizedFileList.map((file) => URL.createObjectURL(file));
      setPreviewUrlList(urlList);
      setImageFileList(resizedFileList);
    }

    e.target.value = "";
  }

  const feedUploadMutation = useMutation({
    mutationFn: (postData: PostData) => uploadFeed(postData),
    onSuccess: () => {
      const userId = auth.currentUser?.uid;
      navigate(`/users/${userId}`);
    },
  });

  const handleUpload = () => {
    const postData = { ...postValue, feedImages: imageFileList };
    feedUploadMutation.mutate(postData);
  };

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

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }

    // 순서 변경 로직
    const reorderedItems = Array.from(previewUrlList);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    // 순서가 변경된 미리보기 URL 리스트 업데이트
    setPreviewUrlList(reorderedItems);

    // 이미지 파일 리스트도 동일한 순서로 재배열
    const reorderedFiles = Array.from(imageFileList);
    const [removedFile] = reorderedFiles.splice(source.index, 1);
    reorderedFiles.splice(destination.index, 0, removedFile);

    // 순서가 변경된 실제 이미지 파일 리스트 업데이트
    setImageFileList(reorderedFiles);
  };

  return (
    <Container>
      <Header title="스타일 업로드" />
      <ContentBox>
        <Paragraph>
          이미지 또는 영상을 업로드하여 <br />
          스타일 크리에이터가 되어보세요
        </Paragraph>
        <Guide>
          OOTD는 <Emphasis>최대 3장</Emphasis>까지 업로드 가능
        </Guide>
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
              onChange={handleImageFileChange}
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
            <FileInputLabel htmlFor="videoUpload"></FileInputLabel>
            <FileInput id="videoUpload" type="file" multiple />
          </UploadWrapper>
        </UploadBox>
        {previewUrlList.length > 0 && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable" direction="horizontal">
              {(provided: DroppableProvided) => (
                <PreviewBox
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {previewUrlList.map((url, index) => (
                    <Draggable key={url} draggableId={url} index={index}>
                      {(provided: DraggableProvided) => (
                        <ImageWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <RemoveBtn onClick={() => handleRemove(index)}>
                            ✕
                          </RemoveBtn>
                          <PreviewImage src={url} />
                          <MarkWrapper>
                            <TextMark>{index === 0 ? "메인" : "서브"}</TextMark>
                            {index !== 0 && <NumMark>{index}</NumMark>}
                          </MarkWrapper>
                        </ImageWrapper>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </PreviewBox>
              )}
            </Droppable>
          </DragDropContext>
        )}
        {previewUrlList.length > 1 && (
          <OrderAdjustmentWrapper>
            <OrderAdjustmentIcon icon={faArrowsLeftRight} />
            <OrderAdjustmentText>
              드래그로 이미지 노출 순서 조정 가능
            </OrderAdjustmentText>
          </OrderAdjustmentWrapper>
        )}
        <OptionTitle>해시태그</OptionTitle>
        <TagInputWrapper>
          <Sharp>#</Sharp>
          <TagInput
            placeholder="태그를 입력해주세요. (최대 5개)"
            onChange={handleInputChange}
            value={hashTagValue}
          />
          <AddBtn onClick={addHashTag}>추가</AddBtn>
        </TagInputWrapper>
        <HashTagList>
          {postValue.hashTag.map((tag) => (
            <HashTagListItem key={tag.id}>
              # {tag.hashTag}
              <HashTagRemoveBtn
                onClick={() => {
                  removeHashTag(tag.id);
                }}
              >
                ✕
              </HashTagRemoveBtn>
            </HashTagListItem>
          ))}
        </HashTagList>
        <OptionTitle>게시글</OptionTitle>
        <PostContent
          name="content"
          placeholder="스타일을 자랑해보세요..."
          onChange={handleChange}
          value={postValue.content}
        ></PostContent>
        <OptionTitle>착용 브랜드</OptionTitle>
        <WearBrandContainer>
          <WearBrandWrapper>
            <WearBrandLabel>아우터</WearBrandLabel>
            <WearBrandInput
              name="outer"
              onChange={handleChange}
              value={postValue.outer}
            />
            <NotExposed
              $isChecked={postValue.outer === "-"}
              onClick={() => {
                setPostValue({ ...postValue, outer: "-" });
              }}
            >
              {postValue.outer === "-" && <CheckIcon icon={faCircleCheck} />}
              노출 안함
            </NotExposed>
          </WearBrandWrapper>
          <WearBrandWrapper>
            <WearBrandLabel>상의</WearBrandLabel>
            <WearBrandInput
              name="top"
              onChange={handleChange}
              value={postValue.top}
            />
            <NotExposed
              $isChecked={postValue.top === "-"}
              onClick={() => {
                setPostValue({ ...postValue, top: "-" });
              }}
            >
              {postValue.top === "-" && <CheckIcon icon={faCircleCheck} />}
              노출 안함
            </NotExposed>
          </WearBrandWrapper>
          <WearBrandWrapper>
            <WearBrandLabel>하의</WearBrandLabel>
            <WearBrandInput
              name="bottom"
              onChange={handleChange}
              value={postValue.bottom}
            />
            <NotExposed
              $isChecked={postValue.bottom === "-"}
              onClick={() => {
                setPostValue({ ...postValue, bottom: "-" });
              }}
            >
              {postValue.bottom === "-" && <CheckIcon icon={faCircleCheck} />}
              노출 안함
            </NotExposed>
          </WearBrandWrapper>
          <WearBrandWrapper>
            <WearBrandLabel>신발</WearBrandLabel>
            <WearBrandInput
              name="shoes"
              onChange={handleChange}
              value={postValue.shoes}
            />
            <NotExposed
              $isChecked={postValue.shoes === "-"}
              onClick={() => {
                setPostValue({ ...postValue, shoes: "-" });
              }}
            >
              {postValue.shoes === "-" && <CheckIcon icon={faCircleCheck} />}
              노출 안함
            </NotExposed>
          </WearBrandWrapper>
        </WearBrandContainer>
        <OptionTitle>성별</OptionTitle>
        <SelectList>
          {GENDER.map((el) => {
            return (
              <SelectItem
                key={el.id}
                $isSelected={postValue.gender === el.value}
                onClick={() => {
                  setPostValue({ ...postValue, gender: el.value });
                }}
              >
                {postValue.gender === el.value && (
                  <CheckIcon icon={faCircleCheck} />
                )}
                {el.value}
              </SelectItem>
            );
          })}
        </SelectList>
        <OptionTitle>스타일</OptionTitle>
        <SelectList>
          {STYLE.map((el) => {
            return (
              <SelectItem
                key={el.id}
                $isSelected={postValue.style === el.value}
                onClick={() => {
                  setPostValue({ ...postValue, style: el.value });
                }}
              >
                {postValue.style === el.value && (
                  <CheckIcon icon={faCircleCheck} />
                )}
                {el.value}
              </SelectItem>
            );
          })}
        </SelectList>
        {feedUploadMutation.isPending ? (
          <LoadingWrapper>
            <SpinnerIcon icon={faSpinner} spinPulse />
          </LoadingWrapper>
        ) : (
          <UploadBtn
            $isChecked={isChecked}
            onClick={() => {
              if (isChecked) {
                handleUpload();
              }
            }}
          >
            스타일 올리기
          </UploadBtn>
        )}
      </ContentBox>
    </Container>
  );
};

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding: 160px 30px;
  background-color: #fff;
`;

const Paragraph = styled.p`
  margin-bottom: 60px;
  font-size: 14px;
  line-height: 1.3;
  text-align: center;
`;

const UploadBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 40px;
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

const OrderAdjustmentWrapper = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const OrderAdjustmentText = styled.div`
  font-size: 14px;
`;

const OrderAdjustmentIcon = styled(FontAwesomeIcon)`
  font-size: 28px;
  margin-bottom: 10px;
`;

const PreviewBox = styled.div`
  display: flex;
  gap: 18px;
  margin-bottom: 20px;
`;

const ImageWrapper = styled.div`
  position: relative;
`;

const MarkWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const TextMark = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const NumMark = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  padding-bottom: 1px;
  border-radius: 50%;
  background-color: #1375ff;
  color: #fff;
  font-size: 12px;
`;

const RemoveBtn = styled.div`
  position: absolute;
  top: -12px;
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
  margin-bottom: 8px;
`;

const OptionTitle = styled.h2`
  margin-top: 50px;
  margin-bottom: 18px;
  font-size: 14px;
  font-weight: 500;
`;

const TagInputWrapper = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const TagInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 54px 0 32px;
  border-radius: 8px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  outline: none;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;

  &::placeholder {
    color: rgba(1, 1, 1, 0.4);
  }
`;

const Sharp = styled.div`
  position: absolute;
  top: 13px;
  left: 14px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 18px;
  font-weight: 500;
`;

const AddBtn = styled.div`
  position: absolute;
  top: 17px;
  right: 14px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  &:hover {
    cursor: pointer;
  }
`;

const HashTagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
`;

const HashTagListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 8px 10px;
  border-radius: 20px;
  border: 1px solid rgba(1, 1, 1, 0.7);
  color: rgba(1, 1, 1, 0.8);
  font-size: 14px;
`;

const HashTagRemoveBtn = styled.div`
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
`;

const PostContent = styled.textarea`
  width: 100%;
  height: 180px;
  padding: 20px;
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

const WearBrandContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const WearBrandWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const WearBrandLabel = styled.label`
  display: inline-block;
  width: 54px;
  color: rgba(1, 1, 1, 0.5);
  font-size: 14px;
`;

const WearBrandInput = styled.input`
  display: inline-block;
  width: 200px;
  height: 30px;
  margin-right: 10px;
  padding-left: 10px;
  border-radius: 6px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  outline: none;
  font-size: 12px;
  color: rgba(1, 1, 1, 0.5);
`;

const NotExposed = styled.div<{ $isChecked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  border: ${({ $isChecked }) =>
    $isChecked
      ? "1px solid rgba(1, 1, 1, 0.8)"
      : "1px solid rgba(1, 1, 1, 0.3)"};
  color: rgba(1, 1, 1, 0.8);
  font-size: 12px;
  &:hover {
    cursor: pointer;
  }
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

const UploadBtn = styled.div<{ $isChecked: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 48px;
  border-radius: 8px;
  background-color: ${({ $isChecked }) =>
    $isChecked ? "rgba(1, 1, 1, 0.9)" : "rgba(1, 1, 1, 0.1)"};
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

export default PostUpload;
