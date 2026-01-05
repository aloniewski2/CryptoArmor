import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, 
  Search, 
  Wallet, 
  FlaskConical, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Server,
  Skull,
  BookOpen,
  Settings,
  Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainNavItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Transaction Scan", href: "/scanner", icon: Search },
  { label: "Wallet Reputation", href: "/wallet", icon: Wallet },
  { label: "Attack Simulations", href: "/testing", icon: FlaskConical },
  { label: "Documentation", href: "/docs", icon: FileText },
];

const testnetNavItems = [
  { label: "Overview", href: "/testnet", icon: Server },
  { label: "RPC Connection", href: "/testnet/connection", icon: Wifi },
  { label: "Attack Simulation", href: "/testnet/simulation", icon: Skull },
  { label: "Setup Guide", href: "/testnet/setup", icon: BookOpen },
  { label: "Compliance", href: "/testnet/compliance", icon: Settings },
];

interface AppSidebarProps {
  children: React.ReactNode;
}

export function AppSidebar({ children }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  const isTestnetRoute = location.pathname.startsWith("/testnet");
  const [testnetOpen, setTestnetOpen] = useState(isTestnetRoute);

  const NavItem = ({ item }: { item: typeof mainNavItems[0] }) => {
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm",
          collapsed && "justify-center px-2",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
        title={collapsed ? item.label : undefined}
      >
        <item.icon className={cn("h-4 w-4 flex-shrink-0", isActive && "text-primary")} />
        {!collapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar transition-all duration-300 flex flex-col",
          collapsed ? "w-14" : "w-56"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center h-12 border-b border-border px-3",
          collapsed ? "justify-center" : "gap-2"
        )}>
          <Shield className="h-5 w-5 text-primary flex-shrink-0" />
          {!collapsed && (
            <span className="font-display text-base tracking-tight">
              Crypto<span className="text-primary">Armor</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {/* Main Nav */}
          {mainNavItems.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
          
          {/* Testnet Section */}
          {collapsed ? (
            <Link
              to="/testnet"
              className={cn(
                "flex items-center justify-center px-2 py-2 rounded-md transition-colors text-sm",
                isTestnetRoute
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              title="Testnet"
            >
              <Server className={cn("h-4 w-4", isTestnetRoute && "text-primary")} />
            </Link>
          ) : (
            <Collapsible open={testnetOpen} onOpenChange={setTestnetOpen}>
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-md transition-colors text-sm",
                    isTestnetRoute
                      ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Server className={cn("h-4 w-4", isTestnetRoute && "text-primary")} />
                    <span>Testnet</span>
                    <Badge variant="warning" className="text-[9px] px-1 py-0">NEW</Badge>
                  </div>
                  <ChevronDown className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform",
                    testnetOpen && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1 space-y-0.5">
                {testnetNavItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-colors text-xs",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                      )}
                    >
                      <item.icon className={cn("h-3.5 w-3.5", isActive && "text-primary")} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </CollapsibleContent>
            </Collapsible>
          )}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-muted-foreground hover:text-foreground h-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      <main className={cn("flex-1 transition-all duration-300", collapsed ? "ml-14" : "ml-56")}>
        {children}
      </main>
    </div>
  );
}
