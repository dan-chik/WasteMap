'use client';
import { useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BinIcon, Icons } from '@/components/icons';
import type { Bin, BinType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

function AddBinForm({ onFinished }: { onFinished: () => void }) {
    const { addBin } = useApp();
    const [type, setType] = useState<BinType>('plastic');
    const [lat, setLat] = useState(50);
    const [lng, setLng] = useState(50);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBin: Omit<Bin, 'id'> = {
            type,
            location: { lat, lng },
            fillLevel: 0,
            status: 'ok',
        };
        addBin(newBin);
        onFinished();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="type">Bin Type</Label>
                <Select onValueChange={(value: BinType) => setType(value)} defaultValue={type}>
                    <SelectTrigger id="type">
                        <SelectValue placeholder="Select a bin type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="plastic">Plastic</SelectItem>
                        <SelectItem value="paper">Paper</SelectItem>
                        <SelectItem value="glass">Glass</SelectItem>
                        <SelectItem value="organic">Organic</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input id="lat" type="number" value={lat} onChange={e => setLat(Number(e.target.value))} min="0" max="100" />
                </div>
                <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input id="lng" type="number" value={lng} onChange={e => setLng(Number(e.target.value))} min="0" max="100" />
                </div>
            </div>
            <Button type="submit" className="w-full">Add Bin</Button>
        </form>
    );
}

export default function ManageBinsPage() {
    const { bins, removeBin } = useApp();
    const [isAddBinOpen, setIsAddBinOpen] = useState(false);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Manage Bins</CardTitle>
                    <CardDescription>Add, remove, and view all bins in the system.</CardDescription>
                </div>
                <Dialog open={isAddBinOpen} onOpenChange={setIsAddBinOpen}>
                    <DialogTrigger asChild>
                        <Button><Icons.add className="mr-2"/> Add Bin</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Bin</DialogTitle>
                        </DialogHeader>
                        <AddBinForm onFinished={() => setIsAddBinOpen(false)} />
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Fill Level</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bins.map((bin) => (
                            <TableRow key={bin.id}>
                                <TableCell className="font-mono text-xs">{bin.id}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 capitalize">
                                        <BinIcon type={bin.type} className="w-4 h-4" />
                                        {bin.type}
                                    </div>
                                </TableCell>
                                <TableCell>({bin.location.lat}, {bin.location.lng})</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                       <Progress value={bin.fillLevel} className="w-24" />
                                       <span>{bin.fillLevel}%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={bin.status === 'ok' ? 'secondary' : 'destructive'} className="capitalize">{bin.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => removeBin(bin.id)}>
                                        <Icons.delete className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
