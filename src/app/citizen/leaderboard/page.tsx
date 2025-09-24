'use client';
import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';

export default function LeaderboardPage() {
    const { users, user: currentUser } = useApp();
    const citizenUsers = users
        .filter(u => u.role === 'citizen')
        .sort((a, b) => (b.points || 0) - (a.points || 0));
        
    const currentUserRank = citizenUsers.findIndex(u => u.id === currentUser?.id) + 1;

    return (
        <div className="grid gap-4">
            <Card className="bg-gradient-to-r from-primary to-cyan-600 text-primary-foreground">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Icons.leaderboard/> Leaderboard</CardTitle>
                    <CardDescription className="text-primary-foreground/80">See who the top eco-contributors are!</CardDescription>
                </CardHeader>
                {currentUserRank > 0 && (
                     <CardContent>
                        <p>Your current rank: <span className="font-bold text-lg">#{currentUserRank}</span></p>
                    </CardContent>
                )}
            </Card>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Points</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {citizenUsers.map((user, index) => (
                                <TableRow key={user.id} className={user.id === currentUser?.id ? 'bg-accent' : ''}>
                                    <TableCell className="font-bold text-lg">#{index + 1}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} />
                                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.username}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">{user.points || 0}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
