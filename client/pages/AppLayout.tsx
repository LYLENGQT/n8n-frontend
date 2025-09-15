import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="sticky top-0 h-screen border-r bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex flex-col w-20 md:w-64">
        <div className="p-4 border-b flex items-center gap-3">
          <div className="size-8 rounded-md bg-muted" />
          <span className="font-semibold hidden md:block">SaaS Auto-Flow</span>
        </div>
        <div className="p-4 flex items-center gap-3 border-b">
          <div className="size-8 rounded-full bg-muted flex items-center justify-center">
            <User className="size-4 text-muted-foreground" />
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-medium">User</div>
            <div className="text-xs text-muted-foreground">user@example.com</div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground border border-border",
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
          className="m-2 mt-auto flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="size-4" />
          <span className="hidden md:inline">Logout</span>
        </button>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
