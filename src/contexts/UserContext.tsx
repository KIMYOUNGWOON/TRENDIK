import { DocumentData } from "firebase/firestore";
import { createContext } from "react";

const UserContext = createContext<DocumentData>({});

export default UserContext;
