'use client';

import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="relative w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl">
        <div className="absolute inset-0">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
          <div className="flex flex-col justify-center p-8 md:p-12 text-white">
            <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter">
              WasteWise
            </h1>
            <p className="mt-4 text-lg md:text-xl text-primary-foreground/80 max-w-md">
              A Smart Waste Management System for a cleaner, more sustainable future.
            </p>
          </div>
          <div className="flex items-center justify-center p-8">
            <Card className="w-full max-w-sm bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <LoginForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
       <footer className="text-center text-muted-foreground text-sm mt-8">
        © {new Date().getFullYear()} WasteWise. All Rights Reserved.
      </footer>
    </main>
  );
}
