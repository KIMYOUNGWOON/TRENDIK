import styled from "styled-components";
import { Link } from "react-router-dom";

function Join() {
  return (
    <>
      <Container>
        <Logo>TRENDIK.</Logo>
        <JoinTitle>회원가입</JoinTitle>
        <ConfirmText>
          이미 계정이 있으신가요? <GoToLogin to="/login">로그인</GoToLogin>
        </ConfirmText>
        <Form>
          <InputWrapper>
            <Label>
              <RequiredMark>•</RequiredMark> 이메일
            </Label>
            <Input />
          </InputWrapper>
          <InputWrapper>
            <Label>
              <RequiredMark>•</RequiredMark> 비밀번호
            </Label>
            <Input />
          </InputWrapper>
          <InputWrapper>
            <Label>
              <RequiredMark>•</RequiredMark> 비밀번호 확인
            </Label>
            <Input />
          </InputWrapper>
          <InputTitle>계정 정보를 입력해 주세요</InputTitle>
        </Form>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  padding: 80px 0;
  background-color: #fff;
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const JoinTitle = styled.div`
  font-size: 36px;
`;

const ConfirmText = styled.div``;

const GoToLogin = styled(Link)`
  color: #3067ec;
`;

const Form = styled.form``;

const InputWrapper = styled.div``;

const Label = styled.label`
  display: block;
`;

const RequiredMark = styled.span`
  color: #f50100;
`;

const Input = styled.input`
  display: block;
`;

const InputTitle = styled.div`
  display: block;
`;

export default Join;
