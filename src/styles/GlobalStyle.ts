import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyles = createGlobalStyle`
  ${reset}
  
  * {
    box-sizing: border-box;
  }
  
  body {
    height: 100%;
    background-color: #222;
    font-family: 'Noto Sans KR', sans-serif;
  }

`;

export default GlobalStyles;
