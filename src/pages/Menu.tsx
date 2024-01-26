import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logOut } from "../api/api";

function Menu() {
  const [isMounted, setIsMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted((prev) => !prev);
  }, []);

  return (
    <Container>
      <Header $isMounted={isMounted}>
        <Title>서비스 설정</Title>
        <BackIcon
          icon={faChevronLeft}
          onClick={() => {
            navigate(-1);
            window.scrollTo(0, 0);
          }}
        />
      </Header>
      <LogOutButton
        onClick={() => {
          logOut();
        }}
      >
        로그아웃
      </LogOutButton>
    </Container>
  );
}

const mount = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const Container = styled.div`
  margin-top: 40px;
  animation: ${mount} 0.2s ease-in-out;
`;

const Header = styled.div<{ $isMounted: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 500px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const BackIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 20px;
  font-size: 30px;
  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.h2`
  font-size: 18px;
`;

const LogOutButton = styled.div`
  padding: 100px;
  font-size: 18px;
  &:hover {
    cursor: pointer;
  }
`;

export default Menu;
