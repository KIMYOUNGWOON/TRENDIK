import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import MainBanner from "./components/MainBanner";

function Main() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <Logo>TRENDIK.</Logo>
        <MenuButton
          icon={faBars}
          onClick={() => {
            navigate("/menu");
            window.scrollTo(0, 0);
          }}
        />
      </Header>
      <MainBanner />
    </Container>
  );
}

const Container = styled.div`
  margin-top: 40px;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 500px;
  height: 74px;
  padding: 0 24px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 28px;
  font-weight: 700;
`;

const MenuButton = styled(FontAwesomeIcon)`
  font-size: 28px;
  font-weight: 700;

  &:hover {
    cursor: pointer;
  }
`;

export default Main;
