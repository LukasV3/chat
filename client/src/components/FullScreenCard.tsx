import { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FullScreenCardProps = {
  children: ReactNode;
};

export const FullScreenCard = ({ children }: FullScreenCardProps) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full">{children}</div>
    </div>
  );
};

FullScreenCard.Body = ({ children }: FullScreenCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
};

FullScreenCard.BelowCard = ({ children }: FullScreenCardProps) => {
  return <div className="mt-2 justify-center flex gap-3">{children}</div>;
};
