import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faUnlockKeyhole } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useMutation } from "@tanstack/react-query";
import { authSignIn } from "../api/userApi";

const INPUT_VALUE = {
  email: "",
  password: "",
};

const LINK_LIST = ["홈으로", "고객지원", "이용약관", "개인정보처리방침"];

function Login() {
  const [inputValue, setInputValue] = useState(INPUT_VALUE);
  const [viewPassword, setViewPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  }

  const loginMutation = useMutation({
    mutationFn: (value: { email: string; password: string }) =>
      authSignIn(value),
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    loginMutation.mutate(inputValue, {
      onSuccess: () => navigate("/"),
      onError: (e) => {
        if (typeof e === "string") {
          alert("이메일 또는 비밀번호를 확인해주세요");
        }
      },
    });
  }

  const ENABLE_BUTTON =
    inputValue.email.length !== 0 && inputValue.password.length !== 0;

  return (
    <Container>
      <ContentBox>
        <Title>로그인</Title>
        <TextLogo>TRENDIK.</TextLogo>
        <Slogan>우린 스타일을 새롭게 쉐어해.</Slogan>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <Label htmlFor="email">
              <InputIcon icon={faEnvelope} />
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="이메일 (example@email.com)"
              value={inputValue.email}
              autoComplete="off"
              onChange={handleChange}
            />
          </InputWrapper>
          <InputWrapper>
            <Label htmlFor="password">
              <InputIcon icon={faUnlockKeyhole} />
            </Label>
            <Input
              id="password"
              name="password"
              placeholder="비밀번호"
              type={viewPassword ? "text" : "password"}
              value={inputValue.password}
              autoComplete="off"
              onChange={handleChange}
            />
            <ViewIcon
              icon={viewPassword ? faEye : faEyeSlash}
              onClick={() => {
                setViewPassword((prev) => !prev);
              }}
            />
          </InputWrapper>
          {loginMutation.isPending ? (
            <LoadingWrapper>
              <SpinnerIcon icon={faSpinner} spinPulse />
            </LoadingWrapper>
          ) : (
            <LoginButton disabled={!ENABLE_BUTTON} $disabled={ENABLE_BUTTON}>
              로그인
            </LoginButton>
          )}
        </Form>
        <ForgetPassword>비밀번호를 잊으셨나요?</ForgetPassword>
        <UserConfirm>
          회원이 아니신가요?{" "}
          <GoToJoin
            onClick={() => {
              navigate("/join");
              window.scrollTo(0, 0);
            }}
          >
            지금 가입하세요
          </GoToJoin>
        </UserConfirm>
        <LinkWrapper>
          {LINK_LIST.map((link, index) => {
            return (
              <LinkElement
                key={index}
                onClick={() => {
                  navigate("/");
                }}
              >
                {link}
              </LinkElement>
            );
          })}
        </LinkWrapper>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  padding: 80px 0 80px;
  background-color: #fff;
`;

const ContentBox = styled.div`
  width: 310px;
  margin: 0 auto;
`;

const Title = styled.div`
  margin-bottom: 160px;
  font-size: 26px;
  text-align: center;
`;

const TextLogo = styled.div`
  margin-bottom: 34px;
  font-size: 34px;
  font-weight: 700;
`;

const Slogan = styled.div`
  margin-bottom: 40px;
  font-size: 20px;
  font-weight: 500;
`;

const Form = styled.form``;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 48px;
  margin-bottom: 10px;
  padding: 0 40px;
  border: 1px solid #f6f7f8;
  border-radius: 6px;
  background-color: #f6f7f8;
  transition: 0.4s;

  &:focus-within {
    border-color: #222;
  }
`;

const Label = styled.label`
  &:hover {
    cursor: pointer;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: 2px solid #222;
  display: block;
  border: none;
  outline: none;
  background: none;
  padding: 0;
  color: #494949;
  font-size: 14px;

  &::placeholder {
    color: #afb0b3;
    font-size: 13px;
  }
`;

const InputIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 13px;
  left: 10px;
  color: #d3d8db;
  font-size: 20px;
`;

const ViewIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 15px;
  right: 10px;
  color: rgba(1, 1, 1, 0.4);
  font-size: 17px;
  transition: 0.4s;

  &:hover {
    cursor: pointer;
    color: rgba(1, 1, 1, 0.7);
  }
`;

const LoginButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  height: 48px;
  margin-top: 16px;
  margin-bottom: 10px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background-color: #c7c9cb;
  background-color: ${({ $disabled }) => ($disabled ? "#222" : "#c7c9cb")};
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const LoadingWrapper = styled.div`
  width: 100%;
  height: 48px;
  margin-top: 26px;
  margin-bottom: 10px;
  text-align: center;
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.8);
  font-size: 40px;
`;

const ForgetPassword = styled.div`
  margin-bottom: 70px;
  color: #74787e;
  font-size: 12px;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
    color: #f50100;
  }
`;

const UserConfirm = styled.div`
  color: #74787e;
  font-size: 14px;
  text-align: center;
  margin-bottom: 250px;
`;

const GoToJoin = styled.span`
  color: #1375ff;
  text-decoration: underline;

  &:hover {
    cursor: pointer;
  }
`;

const LinkWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LinkElement = styled.div`
  color: #a1a7ac;
  font-size: 12px;

  &:hover {
    cursor: pointer;
  }
`;

export default Login;
