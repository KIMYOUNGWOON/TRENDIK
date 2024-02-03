import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const Header: React.FC<{ title: string }> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title>{title}</Title>
      <BackIcon
        icon={faChevronLeft}
        onClick={() => {
          navigate(-1);
          window.scrollTo(0, 0);
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 40px;
  width: 500px;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const BackIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 30px;
  font-size: 30px;
  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.h2`
  font-size: 18px;
`;

export default Header;
