import React from 'react';
import { BriefcaseIcon, Cog6ToothIcon, HomeIcon, UserGroupIcon, UploadIcon } from '../icons';
import { Page } from '../../App';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      <span className="w-6 h-6 mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
};

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const { logout } = useAuth();
  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <HomeIcon /> },
    { id: 'jobs', label: 'Job Posts', icon: <BriefcaseIcon /> },
    { id: 'candidates', label: 'Candidates', icon: <UserGroupIcon /> },
    { id: 'upload', label: 'Upload Resumes', icon: <UploadIcon /> },
  ];

  return (
    <nav className="w-64 h-full bg-card border-r border-border p-4 flex flex-col">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold text-foreground">Talent Scout AI</h1>
        <p className="text-xs text-muted-foreground">by The Matrix</p>
      </div>
      <div className="flex-grow space-y-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            isActive={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </div>
      <div className="mt-auto space-y-2">
        <NavItem
            label="Settings"
            icon={<Cog6ToothIcon />}
            isActive={activePage === 'settings'}
            onClick={() => setActivePage('settings')}
        />
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-200"
        >
          <span className="w-6 h-6 mr-3"><LogoutIcon/></span>
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;