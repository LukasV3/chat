import { FullScreenCard } from "@/components/FullScreenCard";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoggedInAuth } from "@/context/AuthContext";
import { Label } from "@radix-ui/react-label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select, { SelectInstance } from "react-select";

export const NewChannel = () => {
  const { streamChat, user } = useLoggedInAuth();
  const navigate = useNavigate();
  const createChannel = useMutation({
    mutationFn: ({
      name,
      memberIds,
      imageUrl,
    }: {
      name: string;
      memberIds: string[];
      imageUrl?: string;
    }) => {
      if (streamChat == null) throw Error("Not connected");

      return streamChat
        .channel("messaging", crypto.randomUUID(), {
          name,
          image: imageUrl,
          members: [user.id, ...memberIds],
        })
        .create();
    },
    onSuccess: () => {
      navigate("/");
    },
  });
  const nameRef = useRef<HTMLInputElement>(null);
  const imageUrlRef = useRef<HTMLInputElement>(null);
  const memberIdsRef = useRef<
    SelectInstance<{
      label: string;
      value: string;
    }>
  >(null);

  const users = useQuery({
    queryKey: ["stream", "users"],
    queryFn: () =>
      streamChat!.queryUsers({ id: { $ne: user.id } }, { name: 1 }),
    enabled: streamChat != null,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = nameRef.current?.value;
    const imageUrl = imageUrlRef.current?.value;
    const selectOptions = memberIdsRef.current?.getValue();
    if (
      name == null ||
      name == "" ||
      selectOptions == null ||
      selectOptions.length === 0
    ) {
      return;
    }

    createChannel.mutate({
      name,
      imageUrl: imageUrl,
      memberIds: selectOptions.map((option) => option.value),
    });
  };

  return (
    <FullScreenCard>
      <FullScreenCard.Body>
        <CardHeader>
          <CardTitle>
            <h1>New Conversation</h1>
          </CardTitle>

          <CardDescription>
            Create a new conversation below to begin chatting.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input type="text" id="name" required ref={nameRef} />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="imageUrl">Image Url</Label>
              <Input type="text" id="imageUrl" ref={imageUrlRef} />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="members">Members</Label>
              <Select
                ref={memberIdsRef}
                id="members"
                isLoading={users.isPending}
                options={users.data?.users.map((user) => {
                  return {
                    label: user.name,
                    value: user.id,
                  };
                })}
              ></Select>
            </div>

            <Button disabled={createChannel.isPending} type="submit">
              {createChannel.isPending ? "Loading..." : "Create"}
            </Button>
          </form>
        </CardContent>
      </FullScreenCard.Body>

      <FullScreenCard.BelowCard>
        <Button variant="link" asChild>
          <Link to="/">Back</Link>
        </Button>
      </FullScreenCard.BelowCard>
    </FullScreenCard>
  );
};
