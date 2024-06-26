import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  authUserId: string;
}

const Navigation: React.FC<Props> = ({ authUserId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPathName = `/users/${authUserId}`;

  return (
    <Container>
      <IconWrapper>
        <NavIcon
          icon={faHouse}
          onClick={() => {
            navigate("/");
            window.scrollTo(0, 0);
          }}
        />
        <NavIcon
          icon={faMagnifyingGlass}
          onClick={() => {
            navigate("/feeds");
            window.scrollTo(0, 0);
          }}
        />
      </IconWrapper>
      <UploadIcon
        icon={faCirclePlus}
        onClick={() => {
          navigate("/posting");
          window.scrollTo(0, 0);
        }}
      />
      <IconWrapper>
        <NavIcon
          icon={faBookmark}
          onClick={() => {
            navigate(`/${authUserId}/picks`);
            window.scrollTo(0, 0);
          }}
        />
        <NavIcon
          icon={faUser}
          onClick={() => {
            if (currentPathName === location.pathname) {
              navigate(`/users/${authUserId}`, { replace: true });
            } else {
              navigate(`/users/${authUserId}`);
            }
            window.scrollTo(0, 0);
          }}
        />
      </IconWrapper>
    </Container>
  );
};

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 50%;
  width: 500px;
  height: 71px;
  padding: 0 30px;
  background-color: #fff;
  transform: translateX(-50%);
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 64px;
  font-size: 30px;
`;

const NavIcon = styled(FontAwesomeIcon)`
  color: #222;
  font-size: 30px;
  transition: 0.3s;

  &:hover {
    cursor: pointer;
    transform: scale(1.1);
  }
`;

const UploadIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: -14px;
  left: 50%;
  color: #1375ff;
  font-size: 60px;
  transform: translateX(-50%);
  transition: 0.3s;

  &:hover {
    cursor: pointer;
  }
`;

export default Navigation;
