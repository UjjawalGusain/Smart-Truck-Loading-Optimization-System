import { useContext } from "react";
import { UserContext } from "../context/userContext.js";

export const useUser = () => useContext(UserContext);
