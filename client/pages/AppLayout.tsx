  import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { History, Library, LogOut, Settings, Sparkles, User } from "lucide-react";

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/app/generate", label: "Generate", icon: Sparkles },
    { to: "/app/history", label: "History", icon: History },
    { to: "/app/library", label: "Library", icon: Library },
    { to: "/app/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 text-foreground flex">
      <aside className="sticky top-0 h-screen border-r bg-card/60 backdrop-blur-md supports-[backdrop-filter]:bg-card/70 flex flex-col w-20 md:w-64">
        <div className="p-4 border-b flex items-center gap-3">
          <span className="font-semibold hidden md:block tracking-tight">Virtual Photoshoot</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-primary/10 hover:text-foreground",
                  isActive && "bg-primary/15 text-foreground ring-1 ring-primary/30",
                )
              }
            >
              <l.icon className="size-4 text-muted-foreground group-hover:text-foreground" />
              <span className="hidden md:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => navigate("/")}
          className="m-2 mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <div className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-4 md:px-8 py-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{links.find(l => l.to === location.pathname)?.label || "Dashboard"}</div>
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full bg-primary/10 text-primary px-2 py-1">Modern UI</span>
            </div>
          </div>
        </div>
        <div className="px-4 md:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
