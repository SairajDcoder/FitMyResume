import React from 'react';
import ThemeToggle from '../ui/ThemeToggle';
import ProfileDropdown from './ProfileDropdown';
import { Page } from '../../App';

interface HeaderProps {
    pageTitle: string;
    setActivePage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, setActivePage }) => {
  return (
    <header className="flex-shrink-0 bg-card/50 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
          {pageTitle}
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <ProfileDropdown setActivePage={setActivePage} />
        </div>
      </div>
    </header>
  );
};

export default Header;