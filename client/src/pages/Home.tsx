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
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const { user, streamChat } = useLoggedInAuth();

  if (streamChat == null) return <LoadingIndicator />;

  return (
    <Chat client={streamChat}>
      <ChannelList
        List={Channels}
        sendChannelsToList
        filters={{ members: { $in: [user.id] } }}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
      </Channel>
    </Chat>
  );
};

const Channels = ({ loadedChannels }: ChannelListMessengerProps) => {
  const navigate = useNavigate();
  const { logout } = useLoggedInAuth();
  const { setActiveChannel, channel: activeChannel } = useChatContext();

  return (
    <div className="w-60 flex flex-col gap-4 m-3 h-full">
      <Button onClick={() => navigate("/channel/new")}>New Conversation</Button>

      <hr className="border-grey-500" />

      {loadedChannels != null && loadedChannels.length > 0
        ? loadedChannels.map((channel) => {
            const isActive = channel === activeChannel;
            const extraClasses = isActive
              ? "bg-blue-500 text-white"
              : "hover:bg-blue-100 bg-grey-100";

            return (
              <Button
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={`p-4 rounded-lg flex gap-3 items-center ${extraClasses}`}
                disabled={isActive}
              >
                {channel.data?.name || channel.id}
              </Button>
            );
          })
        : "No Conversations"}

      <hr className="border-grey-500 mt-auto" />

      <Button onClick={() => logout.mutate()} disabled={logout.isLoading}>
        Logout
      </Button>
    </div>
  );
};
