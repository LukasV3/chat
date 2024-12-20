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

export const Signup = () => {
  const { signup } = useAuth();
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signup.isPending) return;

    const username = usernameRef.current?.value;
    const name = nameRef.current?.value;
    const imageUrl = imageUrlRef.current?.value;

    if (username == null || username === "" || name == null || name === "") {
      return;
    }

    signup.mutate({ id: username, name, image: imageUrl });
  };

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1>Sign Up</h1>
        </CardTitle>

        <CardDescription>Sign up below to join this chat app.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              pattern="\S*"
              required
              ref={usernameRef}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" required ref={nameRef} />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="imageUrl">Image Url</Label>
            <Input type="url" id="imageUrl" ref={imageUrlRef} />
          </div>

          <Button disabled={signup.isPending} type="submit">
            {signup.isPending ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </>
  );
};
