import styled from "styled-components";
import { componentMount } from "../../styles/Animation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/api";

function UserHome() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      if (id) {
        return getUser(id);
      }
    },
  });

  return (
    <Container>
      <ContentBox>
        <ProfileBox>
          <IconWrapper>
            <BackIcon
              icon={faChevronLeft}
              onClick={() => {
                navigate(-1);
              }}
            />
            <ListIcon icon={faEllipsisVertical} />
          </IconWrapper>
          <ProfileInfoWrapper>
            <ProfileImageWrapper>
              {data?.profileImage ? (
                <ProfileImage src={data?.profileImage} />
              ) : (
                <ProfileIcon icon={faCircleUser} />
              )}
            </ProfileImageWrapper>
            <NickName>{data?.nickName}</NickName>
            <Bio></Bio>
            <FollowBtn>+ 팔로우</FollowBtn>
          </ProfileInfoWrapper>
        </ProfileBox>
      </ContentBox>
    </Container>
  );
}

const Container = styled.div`
  padding-top: 40px;
  animation: ${componentMount} 0.15s linear;
`;

const ContentBox = styled.div``;

const ProfileBox = styled.div`
  height: 400px;
  padding: 30px;
  background-color: rgba(1, 1, 1, 0.4);
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BackIcon = styled(FontAwesomeIcon)`
  font-size: 28px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const ListIcon = styled(FontAwesomeIcon)`
  font-size: 28px;
  color: #fff;

  &:hover {
    cursor: pointer;
  }
`;

const ProfileInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 150px;
`;

const ProfileImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: #fff;
`;

const ProfileImage = styled.img`
  width: 65px;
  height: 65px;
  border-radius: 50%;
`;

const ProfileIcon = styled(FontAwesomeIcon)`
  color: rgba(1, 1, 1, 0.2);
  font-size: 65px;
`;

const NickName = styled.div`
  color: #fff;
  font-weight: 500;
`;

const Bio = styled.div``;

const FollowBtn = styled.div`
  border-radius: 20px;
  padding: 10px 20px;
  background-color: #1375ff;
  color: #fff;
  font-size: 14px;
  text-align: center;
`;

export default UserHome;
