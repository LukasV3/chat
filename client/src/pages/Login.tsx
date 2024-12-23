import { useRef } from "react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

export const Login = () => {
  const { login, user } = useAuth();
  const usernameRef = useRef<HTMLInputElement>(null);

  if (user != null) return <Navigate to="/" />;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login.isPending) return;

    const username = usernameRef.current?.value;

    if (username == null || username === "") {
      return;
    }

    login.mutate(username);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1>Login</h1>
        </CardTitle>

        <CardDescription>Login below to begin chatting.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input type="text" id="username" required ref={usernameRef} />
          </div>

          <Button disabled={login.isPending} type="submit">
            {login.isPending ? "Loading..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </>
  );
};
