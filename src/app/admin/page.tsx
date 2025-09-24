'use client';
import { useApp } from '@/hooks/use-app';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Icons } from '@/components/icons';
import type { BinType } from '@/lib/types';

const CHART_COLORS = {
    paper: 'hsl(var(--chart-1))',
    plastic: 'hsl(var(--chart-2))',
    glass: 'hsl(var(--chart-3))',
    organic: 'hsl(var(--chart-4))'
};

export default function AdminDashboardPage() {
    const { bins, reports } = useApp();

    const wasteDistribution = (['paper', 'plastic', 'glass', 'organic'] as BinType[]).map(type => ({
        type,
        count: bins.filter(bin => bin.type === type).length,
        fill: CHART_COLORS[type]
    }));

    const binFillLevels = bins.map(bin => ({
        name: bin.id,
        fill: bin.fillLevel
    })).sort((a,b) => b.fill - a.fill).slice(0, 10);
    
    const chartConfig = {
        count: { label: 'Bins' },
        paper: { label: 'Paper', color: 'hsl(var(--chart-1))' },
        plastic: { label: 'Plastic', color: 'hsl(var(--chart-2))' },
        glass: { label: 'Glass', color: 'hsl(var(--chart-3))' },
        organic: { label: 'Organic', color: 'hsl(var(--chart-4))' },
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
                    <Icons.unknown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{bins.length}</div>
                    <p className="text-xs text-muted-foreground">Across all categories</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
                    <Icons.reports className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{reports.filter(r => r.status === 'pending').length}</div>
                    <p className="text-xs text-muted-foreground">Reports needing attention</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Fill Level</CardTitle>
                    <Icons.dashboard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {Math.round(bins.reduce((acc, bin) => acc + bin.fillLevel, 0) / bins.length)}%
                    </div>
                    <p className="text-xs text-muted-foreground">System-wide average</p>
                </CardContent>
            </Card>
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Fuel/Time Savings</CardTitle>
                    <Icons.collector className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+15%</div>
                    <p className="text-xs text-muted-foreground">Estimated efficiency gain</p>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Waste Distribution</CardTitle>
                    <CardDescription>Number of bins per waste type.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <PieChart>
                            <ChartTooltip content={<ChartTooltipContent nameKey="type" />} />
                            <Pie data={wasteDistribution} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80}>
                                {wasteDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent nameKey="type"/>} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Top 10 Fullest Bins</CardTitle>
                    <CardDescription>Bins with the highest fill levels currently.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{ fill: { label: 'Fill Level', color: 'hsl(var(--primary))' } }} className="min-h-[200px] w-full">
                        <BarChart data={binFillLevels} accessibilityLayer>
                            <CartesianGrid vertical={false} />
                            <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="fill" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
