import { useMutation, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { createContext, ReactNode, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";

type AuthContextType = {
  user?: User;
  streamChat?: StreamChat;
  signup: UseMutationResult<AxiosResponse, unknown, User>;
  login: UseMutationResult<{ token: string; user: User }, unknown, string>;
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
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();
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

  useEffect(() => {
    if (token == null || user == null) return;

    const chat = new StreamChat(process.env.VITE_STREAM_API_KEY!);

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
    <AuthContext.Provider value={{ signup, login, user, streamChat }}>
      {children}
    </AuthContext.Provider>
  );
};
