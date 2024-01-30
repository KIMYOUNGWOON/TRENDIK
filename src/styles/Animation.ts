import { keyframes } from "styled-components";

export const componentMount = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const editModalOpen = keyframes`
  from {
    height: 0;
    
  }
  to {
    height: 400px;
  }
`;
