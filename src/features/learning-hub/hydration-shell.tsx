import { AppSidebar } from "@/components/app-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { AppSection, UserProfile } from "./types";

type HydrationShellProps = {
  activeSection: AppSection;
  currentUser: UserProfile;
  onNavigate: (item: string) => void;
  onLogout: () => void;
};

export function HydrationShell({
  activeSection,
  currentUser,
  onNavigate,
  onLogout,
}: HydrationShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        activeItem={activeSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
        pendingCount={0}
        user={currentUser}
      />
      <SidebarInset>
        <div className="space-y-6 p-4 md:p-6">
          <Skeleton className="h-8 w-64" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      </SidebarInset>
      <Toaster richColors />
    </SidebarProvider>
  );
}
