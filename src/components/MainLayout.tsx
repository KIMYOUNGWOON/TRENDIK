import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import styled from "styled-components";
import TopBar from "./TopBar";
import Navigation from "./Navigation";
import UserContext from "../contexts/UserContext";
import PageLoading from "./PageLoading";

function MainLayout() {
  const [authUserId, setAuthUserId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUserId(user.uid);
      } else {
        navigate("/login");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <UserContext.Provider value={{ authUserId, setAuthUserId }}>
      <TopBar />
      <Container>{authUserId === "" ? <PageLoading /> : <Outlet />}</Container>
      <Navigation authUserId={authUserId} />
    </UserContext.Provider>
  );
}

const Container = styled.div`
  width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  background-color: #fff;
  overflow-x: hidden;
`;

export default MainLayout;
