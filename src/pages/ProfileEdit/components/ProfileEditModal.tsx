import styled from "styled-components";
import { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkNickName, updateProfile } from "../../../api/userApi";
import { nickNameRegex } from "../../../validation";
import { DocumentData } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface Props {
  isOpened: boolean;
  selected: string;
  authUser: DocumentData;
  editModalClose: () => void;
}

interface KeyType {
  [key: string]: string;
}

const pare: KeyType = {
  nickName: "닉네임",
  gender: "성별",
  height: "키",
  weight: "몸무게",
  shoesSize: "신발 사이즈",
  bio: "소개",
};

const ProfileEditModal: React.FC<Props> = ({
  isOpened,
  selected,
  authUser,
  editModalClose,
}) => {
  const initialValue: KeyType = {
    nickName: "",
    gender: "",
    height: "",
    weight: "",
    shoesSize: "",
    bio: "",
  };
  const { nickName, gender, height, weight, shoesSize, bio } = authUser;
  const [inputValue, setInputValue] = useState(initialValue);
  const [duplicateCheck, setDuplicateCheck] = useState(false);
  const diff = authUser[selected] !== inputValue[selected];
  const validNickName = nickNameRegex.test(inputValue.nickName);
  const queryClient = useQueryClient();

  useEffect(() => {
    setInputValue({
      nickName,
      gender,
      height,
      weight,
      shoesSize,
      bio,
    });
    setDuplicateCheck(false);
  }, [nickName, gender, height, weight, shoesSize, bio, isOpened]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setInputValue({ ...inputValue, [name]: value });
  }

  const editMutation = useMutation({
    mutationFn: (data: { [x: string]: string }) => updateProfile(data),
    onMutate: (data) => {
      queryClient.cancelQueries({ queryKey: ["authUser", authUser.userId] });

      const previousValue = queryClient.getQueryData([
        "authUser",
        authUser.userId,
      ]);

      if (previousValue) {
        queryClient.setQueryData(["authUser", authUser.userId], {
          ...previousValue,
          ...data,
        });
      }

      editModalClose();

      return { previousValue };
    },
    onError: (error, variables, context) => {
      console.error(`An error occurred while ${variables}: ${error.message}`);
      if (context) {
        queryClient.setQueryData(
          ["authUser", authUser.userId],
          context.previousValue
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser", authUser.userId],
      });
      alert("정상적으로 변경되었습니다.");
    },
  });

  function handleEdit() {
    const updateData = { [selected]: inputValue[selected] };
    editMutation.mutate(updateData);
  }

  return (
    <Container $isOpened={isOpened}>
      <Header>
        <Title>{pare[selected]} 변경</Title>
        <CancelBtn onClick={editModalClose}>취소</CancelBtn>
      </Header>
      {selected !== "bio" && selected !== "gender" && (
        <>
          <InputWrapper>
            <Label htmlFor={selected}>{pare[selected]}</Label>
            <Input
              id={selected}
              name={selected}
              type={selected === "nickName" ? "text" : "number"}
              autoComplete="off"
              value={inputValue[selected] || ""}
              onChange={handleChange}
              $inputWidth={selected === "nickName"}
            />
            {selected === "nickName" &&
              (duplicateCheck ? (
                <CheckComplete>
                  <CheckCompleteIcon icon={faCircleCheck} /> 확인
                </CheckComplete>
              ) : (
                <DuplicateCheck
                  onClick={async () => {
                    const check = await checkNickName(inputValue.nickName);
                    if (check) {
                      alert("사용 가능한 닉네임입니다.");
                      setDuplicateCheck(check);
                    } else {
                      alert("이미 사용 중인 닉네임입니다.");
                    }
                  }}
                >
                  중복 확인
                </DuplicateCheck>
              ))}
            <SaveButton
              $diff={diff}
              onClick={() => {
                if (diff) {
                  if (selected === "nickName") {
                    if (duplicateCheck && validNickName) {
                      handleEdit();
                    } else {
                      alert("닉네임을 확인해 주세요.");
                    }
                  } else {
                    handleEdit();
                  }
                } else {
                  alert("수정된 내용이 없습니다.");
                }
              }}
            >
              저장
            </SaveButton>
          </InputWrapper>
          {!validNickName && (
            <ErrorMessage>
              최소 5자 이상이며 "영문(소문자)", "_"만 사용 가능합니다
            </ErrorMessage>
          )}
        </>
      )}
      {selected === "bio" && (
        <TextAreaWrapper>
          <Label htmlFor={selected}>{pare[selected]}</Label>
          <TextArea
            id={selected}
            name={selected}
            value={inputValue[selected] || ""}
            onChange={handleChange}
          />
          <SaveBio
            $diff={diff}
            onClick={() => {
              if (diff) {
                handleEdit();
              } else {
                alert("수정된 내용이 없습니다.");
              }
            }}
          >
            저장
          </SaveBio>
        </TextAreaWrapper>
      )}
      {selected === "gender" && (
        <GenderSelectBox>
          <GenderSelectTitle>성별</GenderSelectTitle>
          <GenderInputWrapper>
            <GenderInput
              name="gender"
              type="radio"
              value="남성"
              checked={inputValue[selected] === "남성"}
              onChange={handleChange}
            />
            <GenderInputLabel>남성</GenderInputLabel>
          </GenderInputWrapper>
          <GenderInputWrapper>
            <GenderInput
              name="gender"
              type="radio"
              value="여성"
              checked={inputValue[selected] === "여성"}
              onChange={handleChange}
            />
            <GenderInputLabel>여성</GenderInputLabel>
          </GenderInputWrapper>
          <SaveGender
            $diff={diff}
            onClick={() => {
              if (diff) {
                handleEdit();
              } else {
                alert("수정된 내용이 없습니다.");
              }
            }}
          >
            저장
          </SaveGender>
        </GenderSelectBox>
      )}
    </Container>
  );
};

const Container = styled.div<{ $isOpened: boolean }>`
  position: fixed;
  left: 50%;
  bottom: 70px;
  width: 500px;
  height: 410px;
  background-color: #fff;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  transform: translate(-50%, ${({ $isOpened }) => ($isOpened ? "0" : "100%")});
  opacity: ${({ $isOpened }) => ($isOpened ? 1 : 0)};
  transition: 0.3s;
  overflow: hidden;
`;

const Header = styled.div`
  position: relative;
  padding: 24px;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
`;

const Title = styled.div`
  font-weight: 500;
  text-align: center;
`;

const CancelBtn = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;

  &:hover {
    cursor: pointer;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 30px;
`;

const Label = styled.label`
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input<{ $inputWidth: boolean }>`
  display: block;
  width: ${({ $inputWidth }) => ($inputWidth ? "240px" : "80px")};
  height: 44px;
  padding: 0 16px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  color: #494949;
  outline: none;
`;

const SaveButton = styled.div<{ $diff: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 44px;
  border-radius: 8px;
  background-color: ${({ $diff }) =>
    $diff ? "rgba(1, 1, 1 , 0.8)" : "rgba(1, 1, 1 , 0.1)"};
  color: #fff;
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
`;

const TextAreaWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 30px;
`;

const TextArea = styled.textarea`
  display: block;
  width: 100%;
  height: 150px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  resize: none;
  outline: none;
`;

const SaveBio = styled(SaveButton)<{ $diff: boolean }>`
  width: 100%;
  background-color: ${({ $diff }) =>
    $diff ? "rgba(1, 1, 1 , 0.8)" : "rgba(1, 1, 1 , 0.1)"};
`;

const GenderSelectBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 30px;
`;

const GenderSelectTitle = styled.div`
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  font-weight: 500;
`;

const GenderInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const GenderInputLabel = styled.label`
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
`;

const GenderInput = styled.input``;

const SaveGender = styled(SaveButton)<{ $diff: boolean }>`
  background-color: ${({ $diff }) =>
    $diff ? "rgba(1, 1, 1 , 0.8)" : "rgba(1, 1, 1 , 0.1)"};
`;

const ErrorMessage = styled.div`
  color: #f50100;
  font-size: 12px;
  text-align: center;
`;

const DuplicateCheck = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 41px;
  right: 160px;
  width: 58px;
  height: 24px;
  border-radius: 6px;
  background-color: rgba(1, 1, 1, 0.2);
  color: #fff;
  font-size: 10px;

  &:hover {
    cursor: pointer;
    background-color: rgba(1, 1, 1, 0.8);
  }
`;

const CheckComplete = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  top: 41px;
  right: 160px;
  width: 58px;
  height: 24px;
  border-radius: 6px;
  background-color: #1375ff;
  color: #fff;
  font-size: 10px;
`;

const CheckCompleteIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 10px;
`;

export default ProfileEditModal;
