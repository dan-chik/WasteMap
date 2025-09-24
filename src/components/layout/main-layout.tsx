'use client';

import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { Header } from '@/components/layout/header';

type MainLayoutProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
};

export function MainLayout({ children, sidebar }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        {sidebar}
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <Header />
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// Alternative modern layout
export function ModernLayout({ children, sidebar }: MainLayoutProps) {
    return (
        <SidebarProvider>
            {sidebar}
            <SidebarInset>
                <Header/>
                <main className="p-4 md:p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    )
}
