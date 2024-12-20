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

export const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <CardHeader>
        <CardTitle>
          <h1>Sign Up</h1>
        </CardTitle>

        <CardDescription>Sign up below to join this chat app.</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="flex flex-col gap-4">
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

          <Button type="submit">Sign Up</Button>
        </form>
      </CardContent>
    </>
  );
};
