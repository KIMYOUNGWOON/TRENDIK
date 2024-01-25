import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
  ${reset}
  
  * {
    box-sizing: border-box;
  }
  
  body {
    background-color: #ededed;
    font-family: 'Noto Sans KR', sans-serif;
    line-height: 1;
  }
`;

export default GlobalStyles;
