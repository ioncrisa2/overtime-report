import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole } from '../types';
import { LogOut, PieChart, PlusCircle, List, User as UserIcon, Shield, Menu, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: string;
  onChangeView: (view: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, currentView, onChangeView, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'new-entry', label: 'New Entry', icon: PlusCircle },
    { id: 'history', label: 'History & Summary', icon: List },
  ];

  if (user.role === UserRole.ADMIN) {
    navItems.push({ id: 'admin', label: 'User Menu', icon: Shield });
  }

  const handleDropdownAction = (action: () => void) => {
    action();
    setIsDropdownOpen(false);
  };

  const handleNavClick = (viewId: string) => {
    onChangeView(viewId);
    setIsSidebarOpen(false);
  };

  const NavContent = () => (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <Button
            key={item.id}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn("w-full justify-start", isActive && "bg-secondary")}
            onClick={() => handleNavClick(item.id)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-screen bg-muted/40 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r shadow-lg transform transition-transform duration-300 ease-in-out md:hidden",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
         <div className="h-16 flex items-center justify-between px-6 border-b">
           <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Main Menu</span>
           <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
             <X className="h-5 w-5" />
           </Button>
        </div>
        <NavContent />
      </div>

      {/* Desktop Sidebar - Navigation Links Only */}
      <aside className="bg-background border-r w-64 flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
           <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Main Menu</span>
        </div>
        <NavContent />
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="bg-background h-16 border-b flex items-center justify-between px-4 md:px-8 shadow-sm relative z-20">
          
          {/* Top Left: Icon and Name */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground shadow-sm">
              OT
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:inline-block">HolidayTracker</span>
            <span className="text-xl font-bold tracking-tight sm:hidden">HT</span>
          </div>

          {/* Top Right: User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 rounded-full hover:bg-muted/50 p-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="hidden md:block text-right mr-1">
                <p className="text-sm font-semibold leading-none">{user.fullName}</p>
                <p className="text-xs text-muted-foreground">@{user.username}</p>
              </div>
              <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.username.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </button>

            {/* Dropdown Menu (Simulated Popover) */}
            {isDropdownOpen && (
              <Card className="absolute right-0 mt-2 w-56 py-1 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                 <div className="px-3 py-2 border-b md:hidden mb-1">
                    <p className="text-sm font-semibold">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                 </div>
                 
                 <div className="px-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start h-9"
                    onClick={() => handleDropdownAction(() => onChangeView('profile'))}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    My Profile
                  </Button>
                  
                  <div className="my-1 border-t" />
                  
                  <Button 
                    variant="ghost"
                    className="w-full justify-start h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDropdownAction(onLogout)}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                 </div>
              </Card>
            )}
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
