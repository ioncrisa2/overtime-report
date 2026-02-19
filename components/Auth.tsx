import React, { useState } from 'react';
import { mockService } from '../services/mockService';
import { User } from '../types';
import { LogIn, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !pin) {
      setError('Please enter both username and PIN');
      return;
    }
    
    try {
      const res = await mockService.login(username, pin);
      if (res.success && res.user) {
        onLogin(res.user);
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Holiday Overtime</CardTitle>
          <CardDescription>Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. jdoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pin">Security PIN</Label>
              <Input
                id="pin"
                type="password"
                maxLength={6}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="font-mono tracking-widest"
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-destructive text-sm rounded-md font-medium text-center">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t pt-6">
           <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold text-center">Demo Access</p>
           <div className="flex gap-4 w-full justify-center">
              <div className="bg-muted px-3 py-2 rounded text-xs text-muted-foreground border">
                User: <span className="font-mono font-bold text-foreground">jdoe</span> / <span className="font-mono font-bold text-foreground">1234</span>
              </div>
              <div className="bg-muted px-3 py-2 rounded text-xs text-muted-foreground border">
                Admin: <span className="font-mono font-bold text-foreground">admin</span> / <span className="font-mono font-bold text-foreground">1234</span>
              </div>
           </div>
        </CardFooter>
      </Card>
    </div>
  );
};
