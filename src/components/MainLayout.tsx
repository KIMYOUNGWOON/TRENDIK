import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import TopBar from "./TopBar";
import Navigation from "./Navigation";
import UserContext from "../contexts/UserContext";
import { getUser } from "../api/userApi";
import PageLoading from "./PageLoading";

function MainLayout() {
  const [authUser, setAuthUser] = useState<DocumentData | undefined>();
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await getUser(user.uid);
        setAuthUser(userData);
      } else {
        navigate("/login");
      }
      setAuthLoading(false);
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <UserContext.Provider value={{ authUser, setAuthUser, authLoading }}>
      <TopBar />
      <Container>{authLoading ? <PageLoading /> : <Outlet />}</Container>
      <Navigation authUser={authUser} />
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
