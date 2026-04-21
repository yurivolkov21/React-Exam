"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  activeItem: string;
  onNavigate: (item: string) => void;
  onLogout: () => void;
  pendingCount: number;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
};

const WORKSPACE_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "tasks", label: "Tasks" },
  { id: "notes", label: "Notes" },
  { id: "assistant", label: "Assistant" },
] as const;

const LIBRARY_ITEMS = ["React patterns", "TypeScript refs", "UI snippets"];

export function AppSidebar({
  activeItem,
  onNavigate,
  onLogout,
  pendingCount,
  user,
  ...props
}: AppSidebarProps) {
  const initial = user.name.charAt(0).toUpperCase();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── Brand header ── */}
      <SidebarHeader style={{ padding: "18px 16px 12px", borderBottom: "1px solid var(--lh-border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--lh-accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--lh-font-display)",
              fontSize: 17,
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            L
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 14,
                fontWeight: 600,
                color: "var(--lh-ink)",
                fontFamily: "var(--lh-font-display)",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              Learning Hub
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "var(--lh-muted-2)",
                lineHeight: 1.3,
              }}
            >
              Semester 1 · Active
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Nav ── */}
      <SidebarContent style={{ padding: "12px 8px 0", overflowY: "auto" }}>
        {/* WORKSPACE */}
        <div style={{ marginBottom: 20 }}>
          <p
            style={{
              margin: "0 0 4px",
              padding: "0 8px",
              fontSize: 10.5,
              fontWeight: 600,
              color: "var(--lh-muted-2)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Workspace
          </p>
          {WORKSPACE_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                padding: "7px 10px",
                borderRadius: "var(--lh-r-sm)",
                background: activeItem === item.id ? "var(--lh-surface-3)" : "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: 13.5,
                fontWeight: activeItem === item.id ? 500 : 400,
                color: activeItem === item.id ? "var(--lh-ink)" : "var(--lh-ink-2)",
                fontFamily: "var(--lh-font-sans)",
                textAlign: "left",
                transition: "background 0.1s",
                marginBottom: 1,
              }}
              onMouseEnter={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.background = "var(--lh-surface-2)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeItem !== item.id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <span>{item.label}</span>
              {item.id === "tasks" && pendingCount > 0 && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--lh-muted)",
                    background: "var(--lh-surface)",
                    border: "1px solid var(--lh-border)",
                    borderRadius: 999,
                    padding: "1px 7px",
                    lineHeight: 1.5,
                  }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* LIBRARY */}
        <div style={{ borderTop: "1px solid var(--lh-border)", paddingTop: 12 }}>
          <p
            style={{
              margin: "0 0 4px",
              padding: "0 8px",
              fontSize: 10.5,
              fontWeight: 600,
              color: "var(--lh-muted-2)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Library
          </p>
          {LIBRARY_ITEMS.map((label) => (
            <button
              key={label}
              style={{
                display: "block",
                width: "100%",
                padding: "7px 10px",
                borderRadius: "var(--lh-r-sm)",
                background: "transparent",
                border: "none",
                cursor: "default",
                fontSize: 13,
                color: "var(--lh-muted)",
                fontFamily: "var(--lh-font-sans)",
                textAlign: "left",
                marginBottom: 1,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </SidebarContent>

      {/* ── User footer ── */}
      <SidebarFooter
        style={{
          padding: "12px 16px",
          borderTop: "1px solid var(--lh-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "var(--lh-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              flexShrink: 0,
              fontFamily: "var(--lh-font-sans)",
            }}
          >
            {initial}
          </div>

          {/* User info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--lh-ink)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: "var(--lh-muted-2)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.email}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            title="Sign out"
            style={{
              width: 28,
              height: 28,
              borderRadius: "var(--lh-r-xs)",
              border: "1px solid var(--lh-border)",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lh-muted)",
              flexShrink: 0,
              transition: "background 0.1s, color 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--lh-danger-bg)";
              e.currentTarget.style.color = "var(--lh-danger)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--lh-muted)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 12H2.5A1.5 1.5 0 0 1 1 10.5v-7A1.5 1.5 0 0 1 2.5 2H5M9.5 10.5 13 7m0 0-3.5-3.5M13 7H5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
