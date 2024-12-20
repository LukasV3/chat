import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { createContext, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  signup: UseMutationResult<AxiosResponse, unknown, User>;
};

type User = {
  id: string;
  name: string;
  image?: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();

  const signup = useMutation({
    mutationFn: (user: User) => {
      return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user);
    },
    onSuccess: () => navigate("/login"),
  });

  return (
    <AuthContext.Provider value={{ signup }}>{children}</AuthContext.Provider>
  );
};
