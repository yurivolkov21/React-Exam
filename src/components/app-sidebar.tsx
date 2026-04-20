"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  AudioLinesIcon,
  TerminalIcon,
  TerminalSquareIcon,
  // BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activeItem: string;
  onNavigate: (item: string) => void;
  onLogout: () => void;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

const data = {
  teams: [
    {
      name: "Semester 1",
      logo: <GalleryVerticalEndIcon />,
      plan: "Active",
    },
    {
      name: "Semester 2",
      logo: <AudioLinesIcon />,
      plan: "Planned",
    },
    {
      name: "Personal Track",
      logo: <TerminalIcon />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Learning Hub",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "dashboard",
        },
        {
          title: "Tasks",
          url: "tasks",
        },
        {
          title: "Notes",
          url: "notes",
        },
        {
          title: "Assistant",
          url: "assistant",
        },
      ],
    },
    {
      title: "Library",
      url: "#",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "React",
          url: "#",
        },
        {
          title: "TypeScript",
          url: "#",
        },
        {
          title: "UI Patterns",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({
  activeItem,
  onNavigate,
  onLogout,
  user,
  ...props
}: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={data.navMain}
          activeItem={activeItem}
          onNavigate={onNavigate}
        />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
