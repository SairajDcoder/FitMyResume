import React from 'react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';

const APP_VERSION = '1.0.0'; // This could come from package.json

const AboutSettings: React.FC = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>About Talent Scout AI</CardTitle>
                <CardDescription>Information about this application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div>
                    <h3 className="font-semibold text-foreground">Version</h3>
                    <p className="text-muted-foreground">{APP_VERSION}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground">Description</h3>
                    <p className="text-muted-foreground">
                        This application leverages Google's Gemini API to intelligently screen job applicants. 
                        It parses resumes, extracts key information, and scores candidates against job requirements 
                        to help HR professionals identify top talent efficiently.
                    </p>
                </div>
                 <div>
                    <h3 className="font-semibold text-foreground">Developed By</h3>
                    <p className="text-muted-foreground">The Matrix</p>
                </div>
            </CardContent>
        </Card>
    );
};

export default AboutSettings;