'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useApp } from '@/hooks/use-app';
import { ModernLayout } from '@/components/layout/main-layout';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from '@/components/ui/sidebar';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const navItems = [
    { href: '/citizen', label: 'Map View', icon: Icons.map },
    { href: '/citizen/reports', label: 'My Reports', icon: Icons.reports },
    { href: '/citizen/leaderboard', label: 'Leaderboard', icon: Icons.leaderboard },
    { href: '/citizen/tips', label: 'Recycling Tips', icon: Icons.tips },
];

function CitizenSidebar() {
    const pathname = usePathname();
    const { user, logout } = useApp();

    return (
        <Sidebar collapsible="icon" variant="inset" side="left">
            <SidebarHeader>
                 <div className="flex items-center gap-2 p-2">
                    <Icons.citizen className="w-8 h-8 p-1.5 bg-primary text-primary-foreground rounded-lg" />
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold text-lg font-headline">Citizen Portal</span>
                        <span className="text-xs text-muted-foreground">WasteWise</span>
                    </div>
                </div>
            </SidebarHeader>
            <Separator />
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map(item => (
                        <SidebarMenuItem key={item.label}>
                            <Link href={item.href}>
                                <SidebarMenuButton
                                    isActive={pathname === item.href}
                                    tooltip={{ children: item.label }}
                                >
                                    <item.icon />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <Separator />
            <SidebarFooter>
                 <div className="flex items-center gap-2 p-2">
                     <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user?.username}`} />
                        <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="font-semibold">{user?.username}</span>
                        <Badge variant="outline" className="w-fit">{user?.points || 0} Points</Badge>
                    </div>
                 </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== 'citizen')) {
            router.replace('/');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex min-h-screen w-full items-center justify-center">
                <div className="w-full max-w-md space-y-4 p-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return <ModernLayout sidebar={<CitizenSidebar />}>{children}</ModernLayout>;
}
