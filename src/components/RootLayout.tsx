import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import TopBar from "./TopBar";
import styled from "styled-components";
import Navigation from "./Navigation";

function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        return;
      } else {
        navigate("/login");
      }
    });
  });

  return (
    <>
      <TopBar />
      <Container>
        <Outlet />
      </Container>
      <Navigation />
    </>
  );
}

const Container = styled.div`
  width: 500px;
  margin: 0 auto;
  overflow-x: hidden;
`;

export default RootLayout;
