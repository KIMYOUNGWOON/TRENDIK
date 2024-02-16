import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface Props {
  tagList: { id: number; hashTag: string }[];
}

const HashTagList: React.FC<Props> = ({ tagList }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <Title># 해시태그</Title>
      <TagList>
        {tagList.map((tag) => (
          <TagListItem
            key={tag.id}
            onClick={() => {
              navigate(`/feeds/search?tag=${tag.hashTag}`);
            }}
          >
            {tag.hashTag}
          </TagListItem>
        ))}
      </TagList>
    </Container>
  );
};

const Container = styled.div`
  padding: 20px;
  margin-bottom: 24px;
`;

const Title = styled.div`
  margin-bottom: 14px;
  color: rgba(1, 1, 1, 0.4);
  font-size: 14px;
  font-weight: 500;
`;

const TagList = styled.ul`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const TagListItem = styled.li`
  padding: 8px 14px;
  color: #2793fb;
  border-radius: 8px;
  background-color: #edf6fc;
  font-size: 14px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`;

export default HashTagList;
