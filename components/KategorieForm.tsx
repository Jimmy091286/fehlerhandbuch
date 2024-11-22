import React, { useState } from 'react';
import { useHandbuch } from '../context/HandbuchContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

export const KategorieForm: React.FC = () => {
  const { addKategorie } = useHandbuch();
  const [neueKategorie, setNeueKategorie] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (neueKategorie.trim()) {
      await addKategorie(neueKategorie.trim());
      setNeueKategorie('');
      toast({
        title: "Kategorie hinzugefügt",
        description: `Die Kategorie "${neueKategorie}" wurde erfolgreich hinzugefügt.`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <Input
        placeholder="Neue Kategorie"
        value={neueKategorie}
        onChange={(e) => setNeueKategorie(e.target.value)}
        required
      />
      <Button type="submit">Hinzufügen</Button>
    </form>
  );
};

