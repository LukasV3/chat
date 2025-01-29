import * as React from "react";
import { Inbox, SquarePen } from "lucide-react";
import { NavUser } from "@/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChannelList,
  ChannelListMessengerProps,
  ChannelPreviewUIComponentProps,
} from "stream-chat-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import type { User } from "@/lib/definitions";

const data = {
  navMain: [
    {
      title: "Chats",
      url: "#",
      icon: Inbox,
      isActive: true,
    },
  ],
};

type AppSidebarProps = {
  user: User;
};

export function AppSidebar({ user }: AppSidebarProps) {
  // TODO: Use url/router to show active item instead of state.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();
  const navigate = useNavigate();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
    >
      {/* first sidebar */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </Sidebar>

      {/* second sidebar */}
      <Sidebar
        collapsible="none"
        className="hidden flex-1 md:flex bg-background"
      >
        <SidebarHeader className="gap-3.5 px-4 pt-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-neutral-950 dark:text-neutral-50">
              Chats
            </div>

            {/* TODO: Unread toggle
              <Label className="flex items-center gap-2 text-sm">
                <span>Unreads</span>
                <Switch className="shadow-none" />
              </Label>
            */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/channel/new")}
            >
              <SquarePen />
            </Button>
          </div>

          {/* TODO: Search functionality
            <SidebarInput placeholder="Type to search..." />
          */}
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent className="[&>div]:border-none">
              <ChannelList
                List={Channels}
                Preview={ChannelItemPreview}
                sendChannelsToList
                filters={{ members: { $in: [user.id] } }}
              />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}

const Channels = ({
  children,
  loadedChannels,
}: React.PropsWithChildren<ChannelListMessengerProps>) => {
  return (
    <>
      {loadedChannels != null && loadedChannels.length > 0 ? (
        <>{children}</>
      ) : (
        <p className="text-center p-4 bg-sidebar">
          🤷 You have no conversations... yet
        </p>
      )}
    </>
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
      className={cn(
        "h-auto px-2 mx-2 my-0.5 py-2 text-sm leading-tight last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        {
          "bg-sidebar-accent": isActive,
        }
      )}
      disabled={isActive}
      variant="ghost"
    >
      <div className="flex h-12 w-12 shrink-0 overflow-hidden rounded-full mr-1">
        {displayImage ? (
          <img src={displayImage} className="aspect-square h-full w-full" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-lg">
            {displayTitle && displayTitle[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-1.5 whitespace-nowrap">
        <div className="flex w-full items-center gap-2">
          <span>{displayTitle || "Unnamed Channel"}</span>
          {""}
          {/*
            TODO: Implement dates
            <span className="ml-auto text-xs">23/07</span>
          */}
        </div>

        <span className="text-left line-clamp-1 w-[200px] whitespace-break-spaces text-xs text-muted-foreground">
          {latestMessagePreview}
        </span>
      </div>
    </Button>
  );
};
