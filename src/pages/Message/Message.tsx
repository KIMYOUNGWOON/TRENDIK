import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/userApi";
import { componentMount } from "../../styles/Animation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { sendMessage, subscribeMessages } from "../../api/directApi";
import UserContext from "../../contexts/UserContext";
import { DocumentData } from "firebase/firestore";

function Message() {
  const { authUserId } = useContext(UserContext);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<DocumentData[]>([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  useEffect(() => {
    const unsubscribe = subscribeMessages(userId, (newMessages) => {
      console.log(newMessages);
      setMessages([...newMessages]);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);

  const { data: user } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => {
      if (userId) {
        return getUser(userId);
      }
    },
    enabled: !!userId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (userId) {
        sendMessage(userId, message);
      }
    },
  });

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (inputValue !== "") {
        const message = inputValue;
        sendMessageMutation.mutate(message);
        window.scrollTo(0, document.body.scrollHeight + 200);
        setInputValue("");
      }
    },
    [inputValue, sendMessageMutation]
  );

  if (!user || !messages) {
    return;
  }

  return (
    <Container>
      <Header>
        <BackIcon
          icon={faChevronLeft}
          onClick={() => {
            navigate(-1);
            window.scrollTo(0, 0);
          }}
        />
        <ProfileWrapper>
          {user.profileImage ? (
            <ProfileImage $profileImage={user.profileImage} />
          ) : (
            <ProfileIcon icon={faCircleUser} />
          )}
          <Nickname>{user.nickName}</Nickname>
        </ProfileWrapper>
      </Header>
      <ContentWrapper>
        <DirectMessageWrapper>
          {messages.map((message: DocumentData, index) => {
            return (
              <DirectMessage
                key={index}
                $isSender={authUserId === message.sender}
              >
                {message.message}
              </DirectMessage>
            );
          })}
        </DirectMessageWrapper>

        <Form onSubmit={handleSubmit}>
          <Input
            placeholder="메세지 보내기..."
            value={inputValue}
            onChange={handleChange}
          />
          <Button $isEntered={inputValue}>
            <ButtonIcon icon={faArrowUpLong} />
          </Button>
        </Form>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  animation: ${componentMount} 0.15s linear;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  position: fixed;
  top: 40px;
  width: 500px;
  height: 60px;
  padding: 0 30px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const BackIcon = styled(FontAwesomeIcon)`
  font-size: 30px;
  &:hover {
    cursor: pointer;
  }
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.div<{ $profileImage: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-image: url(${({ $profileImage }) => $profileImage});
  background-position: center;
  background-size: cover;
`;

const ProfileIcon = styled(FontAwesomeIcon)``;

const Nickname = styled.div`
  font-weight: 600;
`;

const ContentWrapper = styled.div`
  padding-top: 100px;
  padding-bottom: 181px;
`;

const DirectMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #fff;
  padding: 20px;
`;

const DirectMessage = styled.div<{ $isSender: boolean }>`
  max-width: 200px;
  padding: 12px 22px;
  border-radius: 16px;
  color: ${({ $isSender }) => ($isSender ? "#fff" : "#222")};
  background-color: ${({ $isSender }) =>
    $isSender ? "#1375ff" : "rgba(1,1,1,0.1)"};
  align-self: ${({ $isSender }) => ($isSender ? "flex-end" : "flex-start")};
  font-size: 14px;
  line-height: 1.5;
`;

const Form = styled.form`
  position: fixed;
  bottom: 71px;
  width: 500px;
  height: 60px;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 80px;
  background-color: #fff;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding-left: 30px;
  border: none;
  border-radius: 30px;
  background-color: rgba(1, 1, 1, 0.1);
  outline: none;
  font-size: 14px;
  color: rgba(1, 1, 1, 0.7);
  &::placeholder {
    color: rgba(1, 1, 1, 0.3);
  }
`;

const Button = styled.button<{ $isEntered: string }>`
  position: absolute;
  top: 36px;
  right: 40px;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background-color: ${({ $isEntered }) =>
    $isEntered !== "" ? "rgba(19, 117, 255, 1)" : "rgba(19, 117, 255, 0.3)"};
  &:hover {
    cursor: pointer;
  }
`;

const ButtonIcon = styled(FontAwesomeIcon)`
  color: #fff;
  font-weight: 700;
  font-size: 14px;
`;

export default Message;
