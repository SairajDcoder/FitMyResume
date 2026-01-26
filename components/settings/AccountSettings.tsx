import React, { useState, useEffect, useRef } from 'react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { User } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import Avatar from '../ui/Avatar';

interface AccountSettingsProps {
    user: User;
    onUpdateUser: (updatedData: Partial<User>) => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdateUser }) => {
    const { logout } = useAuth();
    const [name, setName] = useState(user.name);
    const [profilePictureUrl, setProfilePictureUrl] = useState(user.profilePictureUrl);
    const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setName(user.name);
        setProfilePictureUrl(user.profilePictureUrl);
    }, [user]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePictureUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        if (!isChanged || saveState !== 'idle') return;
        setSaveState('saving');
        setTimeout(() => {
            onUpdateUser({ name, profilePictureUrl });
            setSaveState('saved');
            setTimeout(() => setSaveState('idle'), 2000);
        }, 500);
    };

    const isChanged = name !== user.name || profilePictureUrl !== user.profilePictureUrl;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Manage your account details and profile picture.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Profile Picture Section */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Profile Picture</label>
                        <div className="flex items-center gap-4">
                           <Avatar user={{ ...user, profilePictureUrl }} className="w-20 h-20 text-3xl"/>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg" className="hidden"/>
                            <div className="flex items-center gap-2">
                                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-muted">
                                    Upload new
                                </button>
                                {profilePictureUrl && (
                                <button onClick={() => setProfilePictureUrl(undefined)} className="px-3 py-1.5 text-sm font-semibold rounded-lg text-destructive-foreground bg-destructive/90 hover:bg-destructive">
                                    Remove
                                </button>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Personal Info Section */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium mb-1 block">Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-input border border-border rounded-md p-2 text-sm" />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-1 block">Email Address</label>
                            <input type="email" value={user.email} readOnly disabled className="w-full bg-muted border border-border rounded-md p-2 text-sm text-muted-foreground cursor-not-allowed" />
                        </div>
                         <div>
                            <label className="text-sm font-medium mb-1 block">Role</label>
                            <input type="text" value={user.role} readOnly disabled className="w-full bg-muted border border-border rounded-md p-2 text-sm text-muted-foreground cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                         <button 
                            onClick={handleSaveChanges}
                            disabled={!isChanged || saveState !== 'idle'}
                            className={`px-4 py-2 w-32 text-sm font-semibold rounded-lg transition-all ${
                                saveState === 'saved' ? 'bg-green-500 text-primary-foreground' :
                                !isChanged || saveState !== 'idle' ? 'bg-muted text-muted-foreground cursor-not-allowed' :
                                'bg-primary hover:bg-primary/90 text-primary-foreground'
                            }`}
                        >
                            {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Logout</CardTitle>
                    <CardDescription>Log out of your account on this device.</CardDescription>
                </CardHeader>
                <CardContent>
                     <button 
                        onClick={logout}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        Log Out
                    </button>
                </CardContent>
            </Card>
        </div>
    );
};

export default AccountSettings;