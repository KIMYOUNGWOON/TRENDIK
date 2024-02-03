import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

function Main() {
  const navigate = useNavigate();

  return (
    <Container>
      <Header>
        <TextLogo>TRENDIK.</TextLogo>
        <MenuButton
          icon={faBars}
          onClick={() => {
            navigate("/menu");
            window.scrollTo(0, 0);
          }}
        />
      </Header>
      <ContentBox></ContentBox>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 500px;
  height: 74px;
  padding: 0 30px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TextLogo = styled.div`
  font-size: 28px;
  font-weight: 800;
`;

const MenuButton = styled(FontAwesomeIcon)`
  font-size: 28px;
  font-weight: 800;

  &:hover {
    cursor: pointer;
  }
`;

const ContentBox = styled.main`
  padding: 110px 30px 0;
`;

export default Main;
