'use client';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function ManageUsersPage() {
    const { users, approveUser } = useApp();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>Approve new collector accounts and view all users.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} />
                                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.username}</p>
                                            <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 capitalize">
                                        {user.role === 'admin' && <Icons.admin className="w-4 h-4"/>}
                                        {user.role === 'collector' && <Icons.collector className="w-4 h-4"/>}
                                        {user.role === 'citizen' && <Icons.citizen className="w-4 h-4"/>}
                                        {user.role}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {user.role === 'collector' ? (
                                        user.approved ? (
                                            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Approved</Badge>
                                        ) : (
                                            <Badge variant="outline">Pending</Badge>
                                        )
                                    ) : (
                                        <span className="text-muted-foreground">-</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {user.role === 'collector' && !user.approved && (
                                        <Button size="sm" onClick={() => approveUser(user.id)}>
                                            <Icons.check className="mr-2 w-4 h-4"/>
                                            Approve
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
