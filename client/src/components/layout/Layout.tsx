import { Link, useLocation } from "wouter";
import { LayoutDashboard, MessageSquareText, Database, Settings, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/mockData";

const SidebarContent = () => {
  const [location] = useLocation();
  const { user, logout } = useStore();

  const navItems = [
    { icon: Database, label: "Knowledge Base", href: "/" },
    { icon: MessageSquareText, label: "Chat Assistant", href: "/chat" },
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", disabled: false },
    { icon: Settings, label: "Settings", href: "/settings", disabled: false },
  ];

  return (
    <div className="flex h-full flex-col glass-panel border-r-0 md:border-r rounded-r-2xl md:rounded-none z-20 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />

      <div className="p-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Database className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-display font-bold text-xl tracking-tight block leading-none">RAG Mind</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Enterprise AI</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 relative z-10">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.disabled ? "#" : item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer group relative overflow-hidden",
                  location === item.href && !item.disabled
                    ? "bg-primary/10 text-primary shadow-sm"
                    : item.disabled
                      ? "text-sidebar-foreground/40 cursor-not-allowed"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {location === item.href && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                )}
                <item.icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  location === item.href ? "scale-110" : "group-hover:scale-110"
                )} />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-border/40 relative z-10">
        <div className="glass-card rounded-xl p-3 flex items-center gap-3 hover:bg-white/60 dark:hover:bg-white/10 transition-colors group">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-[2px]">
            <div className="h-full w-full rounded-full bg-background flex items-center justify-center text-xs font-bold uppercase">
              {user?.name?.slice(0, 2) || "G"}
            </div>
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">
              {user?.name || "Guest"}
            </span>
            <span className="text-[10px] text-muted-foreground">{user?.plan || "Free"} Plan</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-50 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all"
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[280px] h-full flex-shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="glass-panel border-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-r-0 bg-transparent shadow-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-dot-pattern">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px]" />
        </div>
        {children}
      </main>
    </div>
  );
}
