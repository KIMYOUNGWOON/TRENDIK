import styled from "styled-components";

function Footer() {
  return <Wrapper>Footer</Wrapper>;
}

const Wrapper = styled.footer`
  position: fixed;
  width: 768px;
  height: 80px;
  bottom: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #fff;
`;

export default Footer;
