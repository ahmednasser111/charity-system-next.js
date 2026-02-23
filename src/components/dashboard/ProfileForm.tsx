'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Your profile details are managed by the administrator and cannot be edited here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={user.name} disabled />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user.email} disabled type="email" />
          </div>

          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input value={user.phone || ''} disabled />
          </div>

          <Button type="button" disabled className="w-full">
            Profile is read-only
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
