import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import {
  emailRegex,
  passwordRegex,
  passwordLengthRegex,
  englishLetterRegex,
  containNumberRegex,
  containsSpecialCharacterRegex,
} from "../validation";

const INPUT_VALUE = {
  email: "",
  password: "",
  passwordConfirm: "",
  name: "",
  nickName: "",
  serviceAgree: false,
  personalInfoAgree: false,
};

function Join() {
  const [inputValue, setInputValue] = useState(INPUT_VALUE);
  const [viewPassword, setViewPassword] = useState([false, false]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "serviceAgree" || name === "personalInfoAgree") {
      const { checked } = e.target;
      setInputValue({ ...inputValue, [name]: checked });
      return;
    }

    setInputValue({ ...inputValue, [name]: value });
  }

  function typeChange(index: number) {
    viewPassword[index] = !viewPassword[index];
    setViewPassword([...viewPassword]);
  }

  const emailCheck =
    emailRegex.test(inputValue.email) || inputValue.email.length === 0;

  const passwordCheck =
    passwordRegex.test(inputValue.password) || inputValue.password.length === 0;

  const passwordConfirmCheck =
    inputValue.password === inputValue.passwordConfirm ||
    inputValue.passwordConfirm.length === 0;

  const PASSWORD_VALIDATION = [
    {
      id: 1,
      text: "8자 이상",
      isChecked: passwordLengthRegex.test(inputValue.password),
    },
    {
      id: 2,
      text: "영문",
      isChecked: englishLetterRegex.test(inputValue.password),
    },
    {
      id: 3,
      text: "숫자",
      isChecked: containNumberRegex.test(inputValue.password),
    },
    {
      id: 4,
      text: "특수문자",
      isChecked: containsSpecialCharacterRegex.test(inputValue.password),
    },
  ];

  const ENABLE_BUTTON =
    emailCheck &&
    passwordCheck &&
    passwordConfirmCheck &&
    inputValue.name.length !== 0 &&
    inputValue.nickName.length !== 0 &&
    inputValue.serviceAgree &&
    inputValue.personalInfoAgree;

  return (
    <Container>
      <Logo>TRENDIK.</Logo>
      <JoinTitle>회원가입</JoinTitle>
      <ConfirmText>
        이미 계정이 있으신가요? <GoToLogin to="/login">로그인</GoToLogin>
      </ConfirmText>
      <Form onSubmit={() => {}}>
        <InputWrapper>
          <Label htmlFor="email">
            <RequiredMark>•</RequiredMark> 이메일
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="아이디로 사용할 이메일을 입력해 주세요"
            value={inputValue.email}
            autoComplete="off"
            onChange={handleChange}
            $isValidate={emailCheck}
          />
          {!emailCheck && (
            <ErrorMessage>이메일 주소 형식을 확인해 주세요</ErrorMessage>
          )}
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="password">
            <RequiredMark>•</RequiredMark> 비밀번호
          </Label>
          <Input
            id="password"
            name="password"
            type={viewPassword[0] ? "text" : "password"}
            placeholder="비밀번호를 입력해 주세요"
            value={inputValue.password}
            autoComplete="off"
            onChange={handleChange}
            $isValidate={passwordCheck}
          />
          <ValidationContainer>
            {PASSWORD_VALIDATION.map((el) => (
              <ValidationWrapper key={el.id}>
                <CheckIcon icon={faCircleCheck} $isValidate={el.isChecked} />
                <ValidationText>{el.text}</ValidationText>
              </ValidationWrapper>
            ))}
          </ValidationContainer>
          <EyeSlashWrapper>
            {viewPassword[0] ? (
              <EyeIcon
                icon={faEye}
                onClick={() => {
                  typeChange(0);
                }}
              />
            ) : (
              <EyeSlashIcon
                icon={faEyeSlash}
                onClick={() => {
                  typeChange(0);
                }}
              />
            )}
            <DescriptionText>
              {viewPassword[0] ? "비밀번호 숨기기" : "비밀번호 보이기"}
            </DescriptionText>
          </EyeSlashWrapper>
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="passwordConfirm">
            <RequiredMark>•</RequiredMark> 비밀번호 확인
          </Label>
          <Input
            id="passwordConfirm"
            name="passwordConfirm"
            type={viewPassword[1] ? "text" : "password"}
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            value={inputValue.passwordConfirm}
            autoComplete="new-password"
            onChange={handleChange}
            $isValidate={passwordConfirmCheck}
          />
          {!passwordConfirmCheck && (
            <ErrorMessage>비밀번호가 일치하지 않아요</ErrorMessage>
          )}
          <EyeSlashWrapper>
            {viewPassword[1] ? (
              <EyeIcon
                icon={faEye}
                onClick={() => {
                  typeChange(1);
                }}
              />
            ) : (
              <EyeSlashIcon
                icon={faEyeSlash}
                onClick={() => {
                  typeChange(1);
                }}
              />
            )}
            <DescriptionText>
              {viewPassword[1] ? "비밀번호 숨기기" : "비밀번호 보이기"}
            </DescriptionText>
          </EyeSlashWrapper>
        </InputWrapper>
        <InputTitle>계정 정보를 입력해 주세요</InputTitle>
        <InputWrapper>
          <Label htmlFor="name">
            <RequiredMark>•</RequiredMark> 이름
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="이름을 입력해 주세요"
            autoComplete="off"
            value={inputValue.name}
            onChange={handleChange}
            $isValidate={true}
          />
          {!emailCheck && (
            <ErrorMessage>이메일 주소 형식을 확인해 주세요</ErrorMessage>
          )}
        </InputWrapper>
        <InputWrapper>
          <Label htmlFor="nickName">
            <RequiredMark>•</RequiredMark> 닉네임
          </Label>
          <Input
            id="nickName"
            name="nickName"
            placeholder="닉네임을 입력해 주세요"
            value={inputValue.nickName}
            autoComplete="off"
            onChange={handleChange}
            $isValidate={true}
          />
          {!emailCheck && (
            <ErrorMessage>이메일 주소 형식을 확인해 주세요</ErrorMessage>
          )}
        </InputWrapper>
        <AgreeTitle>약관 동의</AgreeTitle>
        <AgreeContainer>
          <AgreeWrapper>
            <CheckBox
              name="serviceAgree"
              type="checkbox"
              onChange={handleChange}
            />
            <AgreeText>[필수] 서비스 이용약관에 동의합니다.</AgreeText>
          </AgreeWrapper>
          <AgreeWrapper>
            <CheckBox
              name="personalInfoAgree"
              type="checkbox"
              onChange={handleChange}
            />
            <AgreeText>[필수] 개인정보 수집 및 이용에 동의합니다.</AgreeText>
          </AgreeWrapper>
        </AgreeContainer>
        <JoinButton disabled={!ENABLE_BUTTON} $disabled={ENABLE_BUTTON}>
          가입하기
        </JoinButton>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  width: 360px;
  margin: 0 auto;
  padding: 120px 0 80px;
  background-color: #fff;
`;

const Logo = styled.div`
  margin-bottom: 34px;
  font-size: 24px;
  font-weight: 700;
`;

const JoinTitle = styled.div`
  margin-bottom: 28px;
  font-size: 28px;
`;

const ConfirmText = styled.div`
  margin-bottom: 70px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
`;

const GoToLogin = styled(Link)`
  color: #1375ff;
`;

const Form = styled.form``;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 40px;
`;

const RequiredMark = styled.span`
  color: #f50100;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;

  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input<{ $isValidate: boolean }>`
  display: block;
  width: 100%;
  height: 38px;
  margin-bottom: 10px;
  padding: 0 16px;
  border: ${({ $isValidate }) =>
    $isValidate ? "1px solid #f6f7f8" : "1px solid #f50100"};
  border-radius: 8px;
  background-color: #f6f7f8;
  outline: none;
  transition: 0.4s;
  color: #494949;

  &::placeholder {
    color: #afb0b3;
    font-size: 12px;
  }

  &:focus {
    border: ${({ $isValidate }) =>
      $isValidate ? "1px solid #494949" : "1px solid #f50100"};
  }
`;

const ValidationContainer = styled.div`
  display: flex;
  gap: 18px;
`;

const ValidationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CheckIcon = styled(FontAwesomeIcon)<{ $isValidate: boolean }>`
  color: ${({ $isValidate }) =>
    $isValidate ? "#1375ff" : "rgba(1, 1, 1, 0.2)"};
  font-size: 15px;
`;

const ValidationText = styled.div`
  color: #6f6f6f;
  font-size: 13px;
`;

const EyeSlashWrapper = styled.div`
  position: absolute;
  top: 36px;
  right: 10px;
`;

const EyeSlashIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.3);
  font-size: 15px;
  transition: 0.4s;

  ${EyeSlashWrapper}:hover & {
    cursor: pointer;
    color: rgba(1, 1, 1, 0.7);
  }
`;

const EyeIcon = styled(EyeSlashIcon)``;

const DescriptionText = styled.div`
  position: absolute;
  top: 30px;
  right: -44px;
  width: 110px;
  padding: 10px;
  border-radius: 6px;
  background-color: #747b81;
  color: #fff;
  font-size: 12px;
  text-align: center;
  transform: scale(0);
  transition: 0.1s;

  ${EyeSlashWrapper}:hover & {
    transform: scale(1);
  }
`;

const ErrorMessage = styled.div`
  color: #f50100;
  font-size: 12px;
`;

const InputTitle = styled.div`
  border-top: 1px solid #e1e1e1;
  margin-bottom: 40px;
  padding-top: 30px;
  color: #676d72;
  font-size: 20px;
  font-weight: 500;
`;

const AgreeTitle = styled.div`
  margin-bottom: 10px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
`;

const AgreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  margin-bottom: 40px;
  background-color: #f6f7f8;
`;

const AgreeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CheckBox = styled.input`
  width: 18px;
  height: 18px;

  &:hover {
    cursor: pointer;
  }
`;

const AgreeText = styled.div`
  color: #83878b;
  font-size: 12px;
`;

const JoinButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 6px;
  background-color: ${({ $disabled }) => ($disabled ? "#222" : "#c7c9cb")};
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

export default Join;
