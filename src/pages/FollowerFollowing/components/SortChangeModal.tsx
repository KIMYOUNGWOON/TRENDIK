import { ChangeEvent } from "react";
import styled from "styled-components";

interface Props {
  sort: string;
  sortChangeModal: boolean;
  handleSortChange: (e: ChangeEvent<HTMLInputElement>) => void;
  toggleSortChangeModal: () => void;
}

const SORT_TYPES = [
  { id: 1, type: "basics", text: "기본" },
  { id: 2, type: "asc", text: "팔로우한 날짜 : 오래된순" },
  { id: 3, type: "desc", text: "팔로우한 날짜 : 최신순" },
];

const SortChangeModal: React.FC<Props> = ({
  sort,
  sortChangeModal,
  handleSortChange,
  toggleSortChangeModal,
}) => {
  return (
    <Container $visible={sortChangeModal}>
      <Header>
        <CloseBar onClick={toggleSortChangeModal} />
        <Title>정렬 기준</Title>
      </Header>
      <SortChangeList>
        {SORT_TYPES.map((type) => {
          return (
            <ListItem key={type.id}>
              <SortType>{type.text}</SortType>
              <ChangeBtn
                name="sort"
                type="radio"
                value={type.type}
                checked={sort === type.type}
                onChange={handleSortChange}
              ></ChangeBtn>
            </ListItem>
          );
        })}
      </SortChangeList>
    </Container>
  );
};

const Container = styled.div<{ $visible: boolean }>`
  position: fixed;
  bottom: 70px;
  width: 500px;
  height: 50%;
  background-color: #fff;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  transform: translateY(${({ $visible }) => ($visible ? "0" : "100%")});
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: 0.3s;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
`;

const CloseBar = styled.div`
  width: 40px;
  height: 4px;
  border-radius: 20px;
  background-color: rgba(1, 1, 1, 0.1);
  margin-bottom: 28px;
  &:hover {
    cursor: pointer;
  }
`;

const Title = styled.div`
  font-weight: 600;
`;

const SortChangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SortType = styled.label``;

const ChangeBtn = styled.input`
  width: 24px;
  height: 24px;
`;

export default SortChangeModal;
