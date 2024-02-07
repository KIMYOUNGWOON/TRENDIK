import { createContext } from "react";

const UserContext = createContext<{
  authUserId: string;
  setAuthUserId: React.Dispatch<React.SetStateAction<string>>;
}>({
  authUserId: "",
  setAuthUserId: () => {},
});

export default UserContext;
