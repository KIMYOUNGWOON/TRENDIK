import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import Header from "../../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone } from "@fortawesome/free-solid-svg-icons";
import { filteringFeeds } from "../../api/filterApi";

function FilterFeeds() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const [key, value] = queryString.split("=");
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["filteredFeeds", `${key}-${decodeURIComponent(value)}`],
    queryFn: () => filteringFeeds(key, decodeURIComponent(value)),
  });

  if (!data) {
    return;
  }

  return (
    <Container>
      <Header title={`${decodeURIComponent(value)}`} />
      {data.length === 0 ? (
        <FeedSearchEmpty>
          <EmptyText>필터링된 게시물이 없습니다.</EmptyText>
          <ReTryText>다른 옵션으로 필터링해보세요.</ReTryText>
        </FeedSearchEmpty>
      ) : (
        <FeedList>
          {data.map((item) => {
            return (
              <FeedListItem
                key={item.id}
                $feedImage={item.feedImages[0]}
                onClick={() => {
                  navigate(`/feeds/${item.id}`);
                }}
              >
                {item.feedImages.length > 1 && <CopyIcon icon={faClone} />}
                <Background>
                  <ViewText>VIEW</ViewText>
                </Background>
              </FeedListItem>
            );
          })}
        </FeedList>
      )}
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const FeedList = styled.ul`
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

const FeedListItem = styled.li<{ $feedImage: string }>`
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

const FeedSearchEmpty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const EmptyText = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 14px;
`;

const ReTryText = styled.div`
  color: rgba(1, 1, 1, 0.5);
  font-size: 14px;
`;

export default FilterFeeds;
