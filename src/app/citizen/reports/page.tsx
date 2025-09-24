'use client';
import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Icons } from '@/components/icons';

export default function MyReportsPage() {
    const { reports, user, bins } = useApp();
    const myReports = reports.filter(r => r.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const getBinType = (binId: string) => {
        return bins.find(b => b.id === binId)?.type || 'unknown';
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Icons.reports /> My Reports</CardTitle>
                <CardDescription>Track the progress of your submitted reports.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Bin ID</TableHead>
                            <TableHead>Report Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {myReports.length > 0 ? myReports.map((report) => (
                            <TableRow key={report.id}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Icons.unknown type={getBinType(report.binId)} className="w-4 h-4"/>
                                        {report.binId}
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">{report.type}</TableCell>
                                <TableCell>{formatDistanceToNow(new Date(report.date), { addSuffix: true })}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant={report.status === 'resolved' ? 'secondary' : 'default'} className={report.status === 'resolved' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200' : ''}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-muted-foreground">You haven't submitted any reports yet.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
