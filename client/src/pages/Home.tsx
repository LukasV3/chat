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
  useChatContext,
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

const Channels = ({ loadedChannels }: ChannelListMessengerProps) => {
  const navigate = useNavigate();
  const { logout } = useLoggedInAuth();
  const { setActiveChannel, channel: activeChannel } = useChatContext();

  return (
    <SheetContent side="right" className="flex flex-col pt-12">
      <Button onClick={() => navigate("/channel/new")} className="w-full">
        New Conversation
      </Button>

      <hr className="border-gray-100" />

      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map((channel) => {
            return (
              <ChannelItemPreview
                key={channel.id}
                image={channel.data?.image}
                name={channel.data?.name}
                isActive={channel === activeChannel}
                handleClick={() => setActiveChannel(channel)}
              />
            );
          })
        : "No Conversations"}

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
  image,
  name,
  isActive,
  handleClick,
}: {
  image?: string;
  name?: string;
  isActive: boolean;
  handleClick: () => void;
}) => {
  return (
    <Button
      onClick={handleClick}
      className="w-full"
      disabled={isActive}
      variant={isActive ? "default" : "ghost"}
    >
      {image && (
        <img
          src={image}
          className="w-10 h-10 rounded-full object-center object-cover"
        />
      )}
      {name || "Unnamed Channel"}
    </Button>
  );
};
