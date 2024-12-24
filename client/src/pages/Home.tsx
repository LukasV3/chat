import { useLoggedInAuth } from "@/context/AuthContext";
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  Window,
  LoadingIndicator,
  MessageList,
  MessageInput,
  ChannelListMessengerProps,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { user, streamChat } = useLoggedInAuth();

  if (streamChat == null) return <LoadingIndicator />;

  return (
    <Chat client={streamChat}>
      <Sheet>
        <ChannelList
          List={Channels}
          Preview={ChannelItemPreview}
          sendChannelsToList
          filters={{ members: { $in: [user.id] } }}
        />
        <Channel>
          <div className="px-6 pb-6 w-full h-screen">
            <Window>
              <div className="flex items-center justify-between py-4 border-b">
                <ChannelHeader />

                <Button variant="outline" asChild>
                  <SheetTrigger>Menu</SheetTrigger>
                </Button>
              </div>

              <MessageList />
              <MessageInput />
            </Window>
          </div>
        </Channel>
      </Sheet>
    </Chat>
  );
};

const Channels = ({
  children,
  loadedChannels,
}: React.PropsWithChildren<ChannelListMessengerProps>) => {
  const navigate = useNavigate();
  const { logout } = useLoggedInAuth();

  return (
    <SheetContent side="right" className="flex flex-col pt-12">
      <Button onClick={() => navigate("/channel/new")} className="w-full">
        New Conversation
      </Button>

      <hr className="border-gray-100" />

      {loadedChannels != null && loadedChannels.length > 0 ? (
        <div>
          <p className="text-gray-500 font-light mb-2">
            {loadedChannels.length}{" "}
            {loadedChannels.length === 1 ? "conversation" : "conversations"}:
          </p>

          <div className="flex flex-col gap-2">{children}</div>
        </div>
      ) : (
        <p className="text-gray-500 font-light">
          "🤷 You have no conversations... yet"
        </p>
      )}

      <hr className="border-gray-100 mt-auto" />

      <Button
        variant="secondary"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="w-full"
      >
        Logout
      </Button>
    </SheetContent>
  );
};

const ChannelItemPreview = ({
  channel,
  activeChannel,
  displayImage,
  displayTitle,
  latestMessagePreview,
  setActiveChannel,
}: ChannelPreviewUIComponentProps) => {
  const isActive = channel.id === activeChannel?.id;

  return (
    <Button
      onClick={() => setActiveChannel?.(channel)}
      className="w-full h-min justify-start"
      disabled={isActive}
      variant={isActive ? "secondary" : "ghost"}
    >
      <div className="flex h-14 w-14 shrink-0 overflow-hidden rounded-full mr-2">
        {displayImage ? (
          <img src={displayImage} className="aspect-square h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-lg">
            {displayTitle && displayTitle[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0.5 text-left truncate">
        <p className="font-bold">{displayTitle || "Unnamed Channel"}</p>

        <p className=" text-gray-500 font-light">{latestMessagePreview}</p>
      </div>
    </Button>
  );
};
