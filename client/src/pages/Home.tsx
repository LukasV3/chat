import { useLoggedInAuth } from "@/context/AuthContext";
import {
  Channel,
  ChannelHeader,
  Chat,
  Window,
  LoadingIndicator,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Home = () => {
  const { user, streamChat } = useLoggedInAuth();

  if (streamChat == null) return <LoadingIndicator />;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <Chat client={streamChat}>
        <AppSidebar user={user} />

        <SidebarInset>
          <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1" />

            <Separator orientation="vertical" className="mr-2 h-4" />

            <Channel>
              <Window>
                <ChannelHeader />
              </Window>
            </Channel>
          </header>

          <Channel>
            <Window>
              <MessageList />

              <div className="sticky bottom-0 border-t bg-background p-4">
                <MessageInput />
              </div>
            </Window>
          </Channel>
        </SidebarInset>
      </Chat>
    </SidebarProvider>
  );
};
