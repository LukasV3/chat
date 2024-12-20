import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

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
  return <Card>{children}</Card>;
};

FullScreenCard.BelowCard = ({ children }: FullScreenCardProps) => {
  return <div className="mt-2 justify-center flex gap-3">{children}</div>;
};
