'use client';

import { useState } from 'react';
import { useApp } from '@/hooks/use-app';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';

export function LoginForm() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
        if (!login(username, password)) {
            setError('Invalid credentials or account not approved. Please try again.');
        }
        setLoading(false);
    }, 500);
  };
  
  const fillDemoCreds = (role: 'citizen' | 'collector' | 'admin') => {
    if (role === 'citizen') {
        setUsername('citizen');
        setPassword('citizen123');
    } else if (role === 'collector') {
        setUsername('collector');
        setPassword('collector123');
    } else {
        setUsername('admin');
        setPassword('admin123');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <h2 className="text-2xl font-headline font-bold text-center text-foreground">
        Welcome Back
      </h2>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="e.g., citizen"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="e.g., citizen123"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Login Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        No account? <a href="#" className="underline">Register</a>
      </div>
      <div className="mt-2 space-y-2 text-sm">
        <p className="text-center text-muted-foreground">Or use a demo account:</p>
        <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={() => fillDemoCreds('citizen')}><Icons.citizen /> Citizen</Button>
            <Button variant="outline" size="sm" type="button" onClick={() => fillDemoCreds('collector')}><Icons.collector /> Collector</Button>
            <Button variant="outline" size="sm" type="button" onClick={() => fillDemoCreds('admin')}><Icons.admin /> Admin</Button>
        </div>
      </div>
    </form>
  );
}
