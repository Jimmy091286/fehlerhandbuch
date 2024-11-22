import React, { useState, useEffect } from 'react';
import { useHandbuch } from '../context/HandbuchContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { DialogClose } from "@/components/ui/dialog"

type EintragFormProps = {
  editId?: string;
  onSubmit: () => void;
};

export const EintragForm: React.FC<EintragFormProps> = ({ editId, onSubmit }) => {
  const { eintraege, kategorien, addEintrag, updateEintrag } = useHandbuch();
  const { toast } = useToast();
  const [kategorie, setKategorie] = useState('');
  const [fehlermeldung, setFehlermeldung] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [loesung, setLoesung] = useState('');

  useEffect(() => {
    if (editId) {
      const eintragToEdit = eintraege.find(e => e.id === editId);
      if (eintragToEdit) {
        setKategorie(eintragToEdit.kategorie);
        setFehlermeldung(eintragToEdit.fehlermeldung);
        setBeschreibung(eintragToEdit.beschreibung);
        setLoesung(eintragToEdit.loesung);
      }
    }
  }, [editId, eintraege]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eintrag = { kategorie, fehlermeldung, beschreibung, loesung };
    if (editId) {
      await updateEintrag(editId, eintrag);
      toast({
        title: "Eintrag aktualisiert",
        description: "Der Eintrag wurde erfolgreich aktualisiert.",
      });
    } else {
      await addEintrag(eintrag);
      toast({
        title: "Eintrag hinzugefügt",
        description: "Der neue Eintrag wurde erfolgreich hinzugefügt.",
      });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={kategorie} onValueChange={setKategorie}>
        <SelectTrigger>
          <SelectValue placeholder="Kategorie auswählen" />
        </SelectTrigger>
        <SelectContent>
          {kategorien.map(kat => (
            <SelectItem key={kat} value={kat}>{kat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        placeholder="Fehlermeldung"
        value={fehlermeldung}
        onChange={(e) => setFehlermeldung(e.target.value)}
        required
      />
      <Textarea
        placeholder="Fehlerbeschreibung"
        value={beschreibung}
        onChange={(e) => setBeschreibung(e.target.value)}
        required
      />
      <Textarea
        placeholder="Lösung"
        value={loesung}
        onChange={(e) => setLoesung(e.target.value)}
        required
      />
      <DialogClose asChild>
        <Button type="submit">{editId ? 'Aktualisieren' : 'Hinzufügen'}</Button>
      </DialogClose>
    </form>
  );
};
