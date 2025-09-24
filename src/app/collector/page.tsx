'use client';
import { useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { MapPlaceholder } from '@/components/map-placeholder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Bin } from '@/lib/types';
import { BinIcon, Icons } from '@/components/icons';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

export default function CollectorDashboardPage() {
    const { bins, getOptimizedRoute, isOptimizingRoute, optimizedRoute, emptyBin, addBinNote } = useApp();
    const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
    const [note, setNote] = useState('');

    const handleNoteSubmit = () => {
        if (selectedBin && note) {
            addBinNote(selectedBin.id, note);
            setNote('');
            const updatedBin = bins.find(b => b.id === selectedBin.id);
            if (updatedBin) setSelectedBin(updatedBin);
        }
    };
    
    const handleEmptyBin = () => {
        if(selectedBin) {
            emptyBin(selectedBin.id);
            const updatedBin = bins.find(b => b.id === selectedBin.id);
            if (updatedBin) setSelectedBin(updatedBin);
        }
    }

    return (
        <div className="grid lg:grid-cols-3 gap-4 h-full">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Bin Map</CardTitle>
                        <CardDescription>View all bins and their fill levels. Click a bin for details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MapPlaceholder bins={bins} onBinClick={setSelectedBin} highlightedBins={optimizedRoute.map(b => b.id)} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Optimized Route</CardTitle>
                        <CardDescription>AI-generated route for bins over 80% full.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={getOptimizedRoute} disabled={isOptimizingRoute} className="w-full">
                            {isOptimizingRoute ? "Optimizing..." : "Generate Optimized Route"}
                        </Button>
                        <ScrollArea className="h-48 mt-4">
                            {isOptimizingRoute ? (
                                <div className="space-y-2">
                                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-8 w-full"/>)}
                                </div>
                            ) : (
                                <ol className="list-decimal list-inside space-y-2 mt-4 text-sm">
                                    {optimizedRoute.length > 0 ? optimizedRoute.map(bin => (
                                        <li key={bin.id} className="font-medium p-2 rounded-md hover:bg-accent">
                                            Bin {bin.id} <span className="text-muted-foreground">({bin.fillLevel}%)</span>
                                        </li>
                                    )) : <p className="text-muted-foreground">No route generated yet.</p>}
                                </ol>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                 {selectedBin && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BinIcon type={selectedBin.type} /> Bin Details</CardTitle>
                            <CardDescription>ID: {selectedBin.id}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div>
                                <Label>Fill Level: {selectedBin.fillLevel}%</Label>
                                <Progress value={selectedBin.fillLevel} />
                            </div>
                            <div>
                                <Label htmlFor="notes">Add Note</Label>
                                <Textarea id="notes" placeholder="e.g., bin is damaged, access blocked" value={note} onChange={e => setNote(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col sm:flex-row gap-2">
                            <Button onClick={handleNoteSubmit} variant="secondary" className="w-full">Add Note</Button>
                            <Button onClick={handleEmptyBin} className="w-full"><Icons.check className="mr-2"/> Mark as Emptied</Button>
                        </CardFooter>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>High Priority Bins</CardTitle>
                        <CardDescription>Bins that are nearly full or reported broken.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ScrollArea className="h-[calc(100vh-14rem)]">
                            <div className="space-y-2">
                            {bins.filter(b => b.fillLevel > 80 || b.status === 'broken').sort((a,b) => b.fillLevel - a.fillLevel).map(bin => (
                                <button key={bin.id} onClick={() => setSelectedBin(bin)} className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold flex items-center gap-2"><BinIcon type={bin.type}/> Bin {bin.id}</p>
                                        {bin.status === 'broken' 
                                            ? <span className="text-xs font-bold text-destructive">BROKEN</span>
                                            : <span className="text-xs font-bold">{bin.fillLevel}%</span>
                                        }
                                    </div>
                                    <p className="text-xs text-muted-foreground capitalize">{bin.type}</p>
                                </button>
                            ))}
                            </div>
                         </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
