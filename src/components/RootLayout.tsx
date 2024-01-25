import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import styled from "styled-components";

function RootLayout() {
  return (
    <>
      <TopBar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  background-color: #fff;
`;

export default RootLayout;
