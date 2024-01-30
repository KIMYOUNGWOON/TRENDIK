import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import styled from "styled-components";
import TopBar from "./TopBar";
import Navigation from "./Navigation";
import UserContext from "../contexts/UserContext";
import { getUser } from "../api/api";

function RootLayout() {
  const [authUser, setAuthUser] = useState<DocumentData | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(await getUser(user.uid));
      } else {
        navigate("/login");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

  return (
    <UserContext.Provider value={{ authUser, setAuthUser }}>
      <TopBar />
      <Container>
        <Outlet />
      </Container>
      <Navigation authUser={authUser} />
    </UserContext.Provider>
  );
}

const Container = styled.div`
  width: 500px;
  height: 100vh;
  margin: 0 auto;
  background-color: #fff;
  overflow-x: hidden;
`;

export default RootLayout;
