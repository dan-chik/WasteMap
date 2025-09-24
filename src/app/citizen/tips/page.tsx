'use client';
import { useState, useEffect } from 'react';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { generateRecyclingTips, GenerateRecyclingTipsOutput } from '@/ai/flows/generate-recycling-tips';
import { Icons } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RecyclingTipsPage() {
    const { reports, user } = useApp();
    const [tips, setTips] = useState<GenerateRecyclingTipsOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTips = async () => {
        setLoading(true);
        setError(null);
        try {
            const userWasteTypes = [...new Set(reports.filter(r => r.userId === user?.id).map(r => r.type))];
            const result = await generateRecyclingTips({
                location: "City Center", // Mock location
                reportedWasteTypes: userWasteTypes.length > 0 ? userWasteTypes : ['plastic', 'paper'],
            });
            setTips(result);
        } catch (e) {
            setError("Failed to generate tips. Please try again later.");
            console.error(e);
        }
        setLoading(false);
    };
    
    useEffect(() => {
        fetchTips();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icons.tips /> Recycling Tips</CardTitle>
                <CardDescription>Get personalized tips to improve your recycling habits.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-6 w-full" />
                    </div>
                ) : error ? (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                ) : (
                    <div className="space-y-4">
                        <ul className="list-disc space-y-3 pl-5 text-sm">
                            {tips?.tips.map((tip, index) => (
                                <li key={index} className="pl-2">{tip}</li>
                            ))}
                        </ul>
                        <Button onClick={fetchTips} disabled={loading}>
                            {loading ? "Generating..." : "Generate New Tips"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
