'use client';
import { useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { MapPlaceholder } from '@/components/map-placeholder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Bin, BinType } from '@/lib/types';
import { BinIcon, Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';

const binTypes: BinType[] = ['plastic', 'paper', 'glass', 'organic'];

export default function CitizenDashboardPage() {
    const { bins, addReport, throwTrash } = useApp();
    const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
    const [filter, setFilter] = useState<BinType | 'all'>('all');

    const filteredBins = filter === 'all' ? bins : bins.filter(bin => bin.type === filter);

    const handleBinClick = (bin: Bin) => {
        setSelectedBin(bin);
    };

    const handleReport = (type: 'full' | 'broken') => {
        if (selectedBin) {
            addReport(selectedBin.id, type);
            setSelectedBin(null);
        }
    };
    
    const handleThrowTrash = () => {
        if (selectedBin) {
            throwTrash(selectedBin.id);
            // Re-fetch bin to show updated fill level
            const updatedBin = bins.find(b => b.id === selectedBin.id);
            if (updatedBin) setSelectedBin(updatedBin);
        }
    }

    return (
        <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Bin Map</CardTitle>
                        <CardDescription>Find a bin near you. Click a bin for more options.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                {binTypes.map(type => (
                                    <TabsTrigger key={type} value={type} className="capitalize">
                                        <BinIcon type={type} className="w-4 h-4 mr-2"/>
                                        {type}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                        <MapPlaceholder bins={filteredBins} onBinClick={handleBinClick} />
                    </CardContent>
                </Card>
            </div>
            <div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Welcome, Citizen!</CardTitle>
                        <CardDescription>Help keep our city clean.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <p className="text-sm text-muted-foreground">Select a bin on the map to see its details, report an issue, or simulate disposing of trash to earn points.</p>
                         <div className="p-4 bg-accent/30 rounded-lg border border-accent">
                             <h4 className="font-semibold flex items-center gap-2"><Icons.tips className="w-4 h-4 text-accent-foreground/80"/> Pro Tip</h4>
                             <p className="text-sm text-accent-foreground/80">Earn points for every action you take! Check your rank on the leaderboard.</p>
                         </div>
                    </CardContent>
                </Card>
            </div>
            {selectedBin && (
                <Dialog open={!!selectedBin} onOpenChange={() => setSelectedBin(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <BinIcon type={selectedBin.type} className="w-5 h-5"/>
                                Bin Details: {selectedBin.id}
                            </DialogTitle>
                            <DialogDescription>
                                <span className="capitalize">{selectedBin.type}</span> bin at location ({selectedBin.location.lat}, {selectedBin.location.lng}).
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Fill Level: {selectedBin.fillLevel}%</Label>
                                <Progress value={selectedBin.fillLevel} />
                            </div>
                            <p>Status: <span className={cn("font-semibold capitalize", selectedBin.status !== 'ok' ? 'text-destructive' : 'text-green-600')}>{selectedBin.status}</span></p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
                                <Button onClick={() => handleThrowTrash()} disabled={selectedBin.fillLevel >= 100}>
                                    <Icons.unknown className="w-4 h-4 mr-2"/>
                                    Dispose Trash (1 pt)
                                </Button>
                                <Button variant="destructive" onClick={() => handleReport('full')}>Report as Full (10 pts)</Button>
                                <Button variant="destructive" className="sm:col-span-2" onClick={() => handleReport('broken')}>Report as Broken (10 pts)</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
