import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import AccountSettings from './AccountSettings';
import AppearanceSettings from './AppearanceSettings';
import AboutSettings from './AboutSettings';
import { UserIcon, SunIcon, InformationCircleIcon } from '../icons';

type SettingsSection = 'account' | 'appearance' | 'about';

const SettingsNav: React.FC<{
    activeSection: SettingsSection, 
    setActiveSection: (section: SettingsSection) => void
}> = ({ activeSection, setActiveSection }) => {
    const navItems = [
        { id: 'account', label: 'Account', icon: <UserIcon className="w-5 h-5"/> },
        { id: 'appearance', label: 'Appearance', icon: <SunIcon className="w-5 h-5"/> },
        { id: 'about', label: 'About', icon: <InformationCircleIcon className="w-5 h-5"/> },
    ];
    return (
        <nav className="flex flex-col space-y-1">
            {navItems.map(item => (
                <button 
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SettingsSection)}
                    className={`flex items-center gap-3 px-3 py-2 text-left text-sm rounded-md transition-colors ${
                        activeSection === item.id 
                            ? 'bg-muted text-foreground font-semibold'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    }`}
                >
                    {item.icon}
                    {item.label}
                </button>
            ))}
        </nav>
    )
}

const SettingsPage: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [activeSection, setActiveSection] = useState<SettingsSection>('account');

    if (!user) {
        return null; // Or a loading/error state
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'account':
                return <AccountSettings user={user} onUpdateUser={updateUser} />;
            case 'appearance':
                return <AppearanceSettings />;
            case 'about':
                return <AboutSettings />;
            default:
                return <AccountSettings user={user} onUpdateUser={updateUser} />;
        }
    };
  
    return (
    <div className="space-y-8">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account, preferences, and application settings.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
                <SettingsNav activeSection={activeSection} setActiveSection={setActiveSection} />
            </div>
            <div className="md:col-span-3">
                {renderSection()}
            </div>
        </div>
    </div>
  );
};

export default SettingsPage;