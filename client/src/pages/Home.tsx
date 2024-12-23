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
} from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

export const Home = () => {
  const { user, streamChat } = useLoggedInAuth();

  if (streamChat == null) return <LoadingIndicator />;

  return (
    <Chat client={streamChat}>
      <ChannelList filters={{ members: { $in: [user.id] } }} />
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
