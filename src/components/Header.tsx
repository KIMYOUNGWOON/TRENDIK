import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWifi } from "@fortawesome/free-solid-svg-icons";
import { faSignal } from "@fortawesome/free-solid-svg-icons";
import { faBatteryThreeQuarters } from "@fortawesome/free-solid-svg-icons";

function Header() {
  function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours} : ${formattedMinutes}`;
  }

  return (
    <Container>
      <CurrentTime>{getCurrentTime()}</CurrentTime>
      <IconWrapper>
        <SignalIcon icon={faSignal} />
        <WifiIcon icon={faWifi} />
        <BatteryIcon icon={faBatteryThreeQuarters} />
      </IconWrapper>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  width: 768px;
  height: 40px;
  padding: 0 30px;
  background-color: #000;
`;

const CurrentTime = styled.div`
  color: #fff;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SignalIcon = styled(FontAwesomeIcon)`
  color: #fff;
`;

const WifiIcon = styled(FontAwesomeIcon)`
  color: #fff;
`;

const BatteryIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-size: 20px;
`;

export default Header;
