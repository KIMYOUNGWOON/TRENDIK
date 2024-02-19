import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { getUserPicks } from "../../api/pickApi";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";

function PickFeed() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["picks", userId],
    queryFn: () => getUserPicks(),
    enabled: !!userId,
  });

  return (
    <Container>
      <Header title="컬렉션" />
      <WishList>
        {data?.map((item) => {
          return (
            <WishListItem
              key={item.id}
              $feedImage={item.feedImages[0]}
              onClick={() => {
                navigate(`/feeds/${item.feedId}`);
              }}
            >
              {item.feedImages.length > 1 && <CopyIcon icon={faClone} />}
              <Background>
                <ViewText>VIEW</ViewText>
              </Background>
            </WishListItem>
          );
        })}
      </WishList>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const WishList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-top: 100px;
`;

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  inset: 0;
  background-color: rgba(1, 1, 1, 0.3);
  opacity: 0;
  transition: 0.4s;
`;

const ViewText = styled.div`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #fff;
  color: #fff;
  font-size: 12px;
`;

const WishListItem = styled.li<{ $feedImage: string }>`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-image: url(${({ $feedImage }) => $feedImage});
  background-position: center;
  background-size: cover;
  transition: 0.4s;
  &:hover {
    cursor: pointer;
    transform: scale(0.95);
    & > ${Background} {
      opacity: 1;
    }
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 10px;
  right: 10px;
  color: #fff;
  font-size: 16px;
`;

export default PickFeed;
