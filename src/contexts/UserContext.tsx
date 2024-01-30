import { DocumentData } from "firebase/firestore";
import { createContext } from "react";

const UserContext = createContext<DocumentData>({
  user: {},
  setUser: () => {},
});

export default UserContext;
