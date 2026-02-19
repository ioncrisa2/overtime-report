import React, { useState } from 'react';
import { User } from '../types';
import { mockService } from '../services/mockService';
import { User as UserIcon, Save, Camera } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const updatedUser = await mockService.updateUserProfile(user.id, {
        fullName,
        phoneNumber
      });
      onUpdate(updatedUser);
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden">
        <div className="bg-primary/5 h-32 relative border-b">
          <div className="absolute -bottom-12 left-8">
            <div className="relative group cursor-pointer">
              <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                 <AvatarImage src={user.avatar} />
                 <AvatarFallback className="text-2xl">{user.username.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <Camera className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        <CardContent className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold tracking-tight">{user.username}</h2>
          <Badge variant="secondary" className="mt-2 uppercase tracking-wide">
            {user.role}
          </Badge>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>WhatsApp Number (For OTP)</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            {message && (
              <p className={`text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-destructive'}`}>
                {message}
              </p>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
                {!loading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
