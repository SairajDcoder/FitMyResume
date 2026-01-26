import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { ThemePreference } from '../../contexts/ThemeContext';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

const AppearanceSettings = () => {
    const { themePreference, setTheme } = useTheme();

    const options: { value: ThemePreference, label: string }[] = [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'system', label: 'System' },
    ];
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Theme</label>
                    <p className="text-xs text-muted-foreground">Select the theme for the dashboard.</p>
                </div>
                <div className="mt-4 flex items-center space-x-2 p-1 rounded-lg bg-muted w-fit">
                    {options.map(option => (
                        <button
                            key={option.value}
                            onClick={() => setTheme(option.value)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                themePreference === option.value
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default AppearanceSettings;
