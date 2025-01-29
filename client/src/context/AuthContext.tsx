import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { createContext, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { User } from "@/lib/definitions";

type AuthContextType = {
  user?: User;
  streamChat?: StreamChat;
  signup: UseMutationResult<AxiosResponse, unknown, User>;
  login: UseMutationResult<{ token: string; user: User }, unknown, string>;
  logout: UseMutationResult<AxiosResponse, unknown, void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};

export const useLoggedInAuth = () => {
  return useContext(AuthContext) as AuthContextType &
    Required<Pick<AuthContextType, "user">>;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage<User>("user");
  const [token, setToken] = useLocalStorage<string>("token");
  const [streamChat, setStreamChat] = useState<StreamChat>();

  const signup = useMutation({
    mutationFn: (user: User) => {
      return axios.post(`${import.meta.env.VITE_SERVER_URL}/signup`, user);
    },
    onSuccess: () => navigate("/login"),
  });

  const login = useMutation({
    mutationFn: (id: string) => {
      return axios
        .post(`${import.meta.env.VITE_SERVER_URL}/login`, { id })
        .then((res) => {
          return res.data as { token: string; user: User };
        });
    },
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
    },
  });

  const logout = useMutation({
    mutationFn: () => {
      return axios.post(`${import.meta.env.VITE_SERVER_URL}/logout`, { token });
    },
    onSuccess: () => {
      setUser(undefined);
      setToken(undefined);
      setStreamChat(undefined);
    },
  });

  useEffect(() => {
    if (token == null || user == null) return;

    const chat = new StreamChat(import.meta.env.VITE_STREAM_API_KEY!);

    if (chat.tokenManager.token === token && chat.userID === user.id) return;

    let isInterrupted = false;
    const connectPromise = chat.connectUser(user, token).then(() => {
      if (isInterrupted) return;
      setStreamChat(chat);
    });

    return () => {
      isInterrupted = true;
      setStreamChat(undefined);
      connectPromise.then(() => chat.disconnectUser());
    };
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ signup, login, user, streamChat, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
