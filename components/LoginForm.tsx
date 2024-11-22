import React, { useState } from 'react';
import { useHandbuch } from '../context/HandbuchContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, logout, user } = useHandbuch();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast({
        title: "Erfolgreich eingeloggt",
        description: "Sie sind jetzt angemeldet.",
      });
    } else {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: "E-Mail oder Passwort ist falsch.",
        variant: "destructive",
      });
    }
  };

  if (user) {
    return (
      <div>
        <p>Eingeloggt als {user.email}</p>
        <Button onClick={logout}>Ausloggen</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">E-Mail</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="password">Passwort</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Einloggen</Button>
    </form>
  );
};

