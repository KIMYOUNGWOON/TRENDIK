import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

function RootLayout() {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
}

const Container = styled.div`
  width: 768px;
  margin: 0 auto;
  background-color: #fff;
`;

export default RootLayout;
