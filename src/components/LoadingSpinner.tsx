import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

function LoadingSpinner() {
  return (
    <LoadingWrapper>
      <SpinnerIcon icon={faSpinner} spinPulse />
    </LoadingWrapper>
  );
}

const LoadingWrapper = styled.div`
  width: 100%;
  height: 48px;
  margin-top: 26px;
  margin-bottom: 10px;
  text-align: center;
`;

const SpinnerIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.8);
  font-size: 40px;
`;

export default LoadingSpinner;
