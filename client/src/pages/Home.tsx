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
          <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-primary-foreground px-4 py-1 [&_.str-chat\_\_channel-header]:bg-primary-foreground">
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

              <div className="sticky bottom-0 border-t bg-primary-foreground p-4 [&_.str-chat\_\_message-input]:bg-primary-foreground">
                <MessageInput />
              </div>
            </Window>
          </Channel>
        </SidebarInset>
      </Chat>
    </SidebarProvider>
  );
};
