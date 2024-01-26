import styled from "styled-components";
import bannerImg from "../../../assets/bannerImg.png";

function MainBanner() {
  return (
    <Container>
      <ImgWrapper>
        <BannerImage src={bannerImg} />
      </ImgWrapper>
      <ImgWrapper>
        <BannerImage src={bannerImg} />
      </ImgWrapper>
      <ImgWrapper>
        <BannerImage src={bannerImg} />
      </ImgWrapper>
      <ImgWrapper>
        <BannerImage src={bannerImg} />
      </ImgWrapper>
      <ImgWrapper>
        <BannerImage src={bannerImg} />
      </ImgWrapper>
    </Container>
  );
}

const Container = styled.div``;

const ImgWrapper = styled.div`
  text-align: center;
`;

const BannerImage = styled.img`
  width: 450px;
  height: 260px;
  border-radius: 10px;
  object-fit: cover;
`;

export default MainBanner;
