import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import {
  authSignUp,
  emailDuplicateCheck,
  nickNameDuplicateCheck,
} from "../api/userApi";
import styled from "styled-components";
import {
  emailRegex,
  passwordRegex,
  passwordLengthRegex,
  englishLetterRegex,
  containNumberRegex,
  containsSpecialCharacterRegex,
  nickNameRegex,
} from "../validation";
import { User } from "../api/types";

const INPUT_VALUE = {
  email: "",
  password: "",
  passwordConfirm: "",
  name: "",
  nickName: "",
  gender: "",
  height: "",
  weight: "",
  shoesSize: "",
  serviceAgree: false,
  personalInfoAgree: false,
};

const DUPLICATE_CHECK: {
  emailCheck: boolean | undefined;
  nickNameCheck: boolean | undefined;
} = {
  emailCheck: false,
  nickNameCheck: false,
};

function Join() {
  const [inputValue, setInputValue] = useState(INPUT_VALUE);
  const [checkValue, setCheckValue] = useState(DUPLICATE_CHECK);
  const [viewPassword, setViewPassword] = useState([false, false]);
  const navigate = useNavigate();

  const allEntered = Object.values(inputValue).every((value) => {
    if (typeof value === "boolean") {
      return value === true;
    } else if (typeof value === "string") {
      return value.length > 0;
    } else {
      return value !== 0;
    }
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "serviceAgree" || name === "personalInfoAgree") {
      const { checked } = e.target;
      setInputValue({ ...inputValue, [name]: checked });
      return;
    }

    if (name === "email" || name === "nickName") {
      setCheckValue({ ...checkValue, [name + "Check"]: false });
    }

    setInputValue({ ...inputValue, [name]: value });
  }

  function typeChange(index: number) {
    viewPassword[index] = !viewPassword[index];
    setViewPassword([...viewPassword]);
  }

  const signUpMutation = useMutation({
    mutationFn: (newUser: User) => authSignUp(newUser),
    onError: (e) => {
      console.log(e);
      alert("이미 사용 중인 이메일입니다.");
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newUser = {
      email: inputValue.email,
      password: inputValue.password,
      name: inputValue.name,
      nickName: inputValue.nickName,
      gender: inputValue.gender,
      height: inputValue.height,
      weight: inputValue.weight,
      shoesSize: inputValue.shoesSize,
    };

    signUpMutation.mutate(newUser);
  }

  const emailCheck =
    emailRegex.test(inputValue.email) || inputValue.email.length === 0;

  const passwordCheck =
    passwordRegex.test(inputValue.password) || inputValue.password.length === 0;

  const passwordConfirmCheck =
    inputValue.password === inputValue.passwordConfirm ||
    inputValue.passwordConfirm.length === 0;

  const nickNameCheck =
    nickNameRegex.test(inputValue.nickName) || inputValue.nickName.length === 0;

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
    checkValue.emailCheck &&
    checkValue.nickNameCheck &&
    emailCheck &&
    passwordCheck &&
    passwordConfirmCheck &&
    nickNameCheck &&
    allEntered;

  return (
    <Container>
      <ContentBox>
        <TextLogo>TRENDIK.</TextLogo>
        <JoinText>회원가입</JoinText>
        <ConfirmText>
          이미 계정이 있으신가요?{" "}
          <GoToLogin
            to="/login"
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            로그인
          </GoToLogin>
        </ConfirmText>
        <Form onSubmit={handleSubmit}>
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
            {checkValue.emailCheck ? (
              <CheckComplete>
                <CheckCompleteIcon icon={faCircleCheck} /> 확인
              </CheckComplete>
            ) : (
              <DuplicateCheck
                onClick={async () => {
                  const check = await emailDuplicateCheck(inputValue.email);
                  if (check) {
                    alert("사용 가능한 이메일 주소입니다.");
                    setCheckValue({ ...checkValue, emailCheck: check });
                  } else {
                    alert("이미 사용 중인 이메일입니다.");
                  }
                }}
              >
                중복 확인
              </DuplicateCheck>
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
            <ValidationBox>
              {PASSWORD_VALIDATION.map((el) => (
                <ValidationWrapper key={el.id}>
                  <CheckIcon icon={faCircleCheck} $isValidate={el.isChecked} />
                  <ValidationText>{el.text}</ValidationText>
                </ValidationWrapper>
              ))}
            </ValidationBox>
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
            {!nickNameCheck && (
              <ErrorMessage>
                최소 5자 이상이며 "영문(소문자)", "_", 숫자만 사용 가능합니다
              </ErrorMessage>
            )}
            {checkValue.nickNameCheck ? (
              <CheckComplete>
                <CheckCompleteIcon icon={faCircleCheck} /> 확인
              </CheckComplete>
            ) : (
              <DuplicateCheck
                onClick={async () => {
                  const check = await nickNameDuplicateCheck(
                    inputValue.nickName
                  );
                  if (check) {
                    alert("사용 가능한 닉네임입니다.");
                    setCheckValue({ ...checkValue, nickNameCheck: check });
                  } else {
                    alert("이미 사용 중인 닉네임입니다.");
                  }
                }}
              >
                중복 확인
              </DuplicateCheck>
            )}
          </InputWrapper>
          <GenderSelectTitle>
            <RequiredMark>•</RequiredMark> 성별
          </GenderSelectTitle>
          <GenderSelectContainer>
            <GenderSelectWrapper>
              <RadioInput
                name="gender"
                type="radio"
                value="남성"
                onChange={handleChange}
              />
              <RadioLabel>남성</RadioLabel>
            </GenderSelectWrapper>
            <GenderSelectWrapper>
              <RadioInput
                name="gender"
                type="radio"
                value="여성"
                onChange={handleChange}
              />
              <RadioLabel>여성</RadioLabel>
            </GenderSelectWrapper>
          </GenderSelectContainer>
          <BodyInfoInputContainer>
            <BodyInfoInputWrapper>
              <BodyInfoInputLabel>
                <RequiredMark>•</RequiredMark> 키
              </BodyInfoInputLabel>
              <BodyInfoInput
                type="number"
                name="height"
                maxLength={3}
                onChange={handleChange}
                value={inputValue.height}
              />
              <BodyInfoUnit>cm</BodyInfoUnit>
            </BodyInfoInputWrapper>
            <BodyInfoInputWrapper>
              <BodyInfoInputLabel>
                <RequiredMark>•</RequiredMark> 몸무게
              </BodyInfoInputLabel>
              <BodyInfoInput
                type="number"
                name="weight"
                maxLength={3}
                onChange={handleChange}
                value={inputValue.weight}
              />
              <BodyInfoUnit>kg</BodyInfoUnit>
            </BodyInfoInputWrapper>
            <BodyInfoInputWrapper>
              <BodyInfoInputLabel>
                <RequiredMark>•</RequiredMark> 신발 사이즈
              </BodyInfoInputLabel>
              <BodyInfoInput
                type="number"
                name="shoesSize"
                maxLength={3}
                onChange={handleChange}
                value={inputValue.shoesSize}
              />
              <BodyInfoUnit>mm</BodyInfoUnit>
            </BodyInfoInputWrapper>
          </BodyInfoInputContainer>
          <AgreeTitle>약관 동의</AgreeTitle>
          <AgreeBox>
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
          </AgreeBox>
          {signUpMutation.isPending ? (
            <LoadingWrapper>
              <SpinnerIcon icon={faSpinner} spinPulse />
            </LoadingWrapper>
          ) : (
            <JoinButton disabled={!ENABLE_BUTTON} $disabled={ENABLE_BUTTON}>
              가입하기
            </JoinButton>
          )}
        </Form>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  padding: 120px 0 80px;
  background-color: #fff;
`;

const ContentBox = styled.div`
  width: 360px;
  margin: 0 auto;
`;

const TextLogo = styled.div`
  margin-bottom: 34px;
  font-size: 32px;
  font-weight: 700;
`;

const JoinText = styled.div`
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
  padding: 0 60px 0 16px;
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

const ValidationBox = styled.div`
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
  top: 34px;
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
  margin-top: 10px;
`;

const DuplicateCheck = styled.div`
  position: absolute;
  top: 32px;
  right: 10px;
  padding: 6px 10px;
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
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  top: 32px;
  right: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: #1375ff;
  color: #fff;
  font-size: 10px;
`;

const CheckCompleteIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 10px;
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

const AgreeBox = styled.div`
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

const JoinButton = styled.button<{ $disabled: boolean | undefined }>`
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
const GenderSelectTitle = styled.div`
  display: block;
  margin-bottom: 10px;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
`;

const GenderSelectContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

const GenderSelectWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const RadioLabel = styled.label`
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
`;

const RadioInput = styled.input``;

const BodyInfoInputContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
`;

const BodyInfoInputWrapper = styled.div`
  align-items: center;
  gap: 8px;
`;

const BodyInfoInputLabel = styled.label`
  display: block;
  color: rgba(1, 1, 1, 0.7);
  font-size: 14px;
  margin-bottom: 10px;

  &:hover {
    cursor: pointer;
  }
`;

const BodyInfoInput = styled.input`
  display: inline-block;
  width: 70px;
  height: 34px;
  margin-right: 8px;
  padding-left: 20px;
  border: none;
  border-radius: 8px;
  background-color: #f6f7f8;
  outline: none;
  color: #494949;

  &::placeholder {
    color: #afb0b3;
    font-size: 12px;
  }
`;

const BodyInfoUnit = styled.span`
  font-size: 14px;
`;

const LoadingWrapper = styled.div`
  text-align: center;
  height: 48px;
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.8);
  font-size: 40px;
`;

export default Join;
