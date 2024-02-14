import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getUser, logOut } from "../../api/userApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Header from "../../components/Header";
import UserContext from "../../contexts/UserContext";
import { componentMount } from "../../styles/Animation";
import { useQuery } from "@tanstack/react-query";
import MenuSkeletonUi from "./components/MenuSkeletonUi";

function Menu() {
  const { authUserId } = useContext(UserContext);
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["authUser", authUserId],
    queryFn: () => getUser(authUserId),
    enabled: !!authUserId,
  });

  return (
    <Container>
      <Header title="더 보기" />
      <ContentBox>
        <ProfileBox>
          {isLoading || authUserId === "" ? (
            <MenuSkeletonUi />
          ) : (
            <ProfileWrapper>
              <ProfileImageWrapper>
                <ProfileIcon icon={faCircleUser} />
                {data?.profileImage && (
                  <ProfileImage $profileImage={data?.profileImage} />
                )}
              </ProfileImageWrapper>
              <Nickname>{data?.nickName}</Nickname>
            </ProfileWrapper>
          )}
          <EditButton
            onClick={() => {
              navigate("/profile-edit");
            }}
          >
            프로필 설정
          </EditButton>
        </ProfileBox>
        <ListBox>
          <ListItemWrapper>
            <ListIcon icon={faUsers} $color={false} />
            <ListText
              $color={false}
              onClick={() => {
                navigate("/users");
              }}
            >
              사용자 둘러보기
            </ListText>
          </ListItemWrapper>
          <ListItemWrapper>
            <ListIcon icon={faGear} $color={false} />
            <ListText
              $color={false}
              onClick={() => {
                navigate("/account-info");
              }}
            >
              계정 정보
            </ListText>
          </ListItemWrapper>
          <ListItemWrapper>
            <ListIcon icon={faArrowRightFromBracket} $color={true} />
            <ListText
              $color={true}
              onClick={() => {
                logOut();
              }}
            >
              로그아웃
            </ListText>
          </ListItemWrapper>
        </ListBox>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div`
  padding: 130px 30px 0;
  background-color: #fff;
`;

const ProfileBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(1, 1, 1, 0.4);
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  position: absolute;
  top: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-size: cover;
  background-position: center;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.1);
  font-size: 60px;
`;

const Nickname = styled.div`
  padding-bottom: 6px;
  font-size: 18px;
  font-weight: 600;
`;

const EditButton = styled.div`
  padding: 10px 20px;
  border: 1px solid rgba(1, 1, 1, 0.3);
  border-radius: 8px;
  color: rgba(1, 1, 1, 0.4);
  font-size: 12px;
  transition: 0.4s;

  &:hover {
    cursor: pointer;
    border: 1px solid rgba(1, 1, 1, 0.9);
    color: rgba(1, 1, 1, 0.9);
  }
`;

const ListBox = styled.div``;

const ListItemWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 0;
  border-bottom: 1px solid rgba(1, 1, 1, 0.1);
`;

const ListIcon = styled(FontAwesomeIcon)<{ $color: boolean }>`
  color: ${({ $color }) => ($color ? "#f50100" : "#222")};
  font-size: 24px;
`;

const ListText = styled.div<{ $color: boolean }>`
  color: ${({ $color }) => ($color ? "#f50100" : "#222")};
  &:hover {
    cursor: pointer;
  }
`;

export default Menu;
