import React, { useState, useMemo, useEffect } from 'react';
import { useHandbuch } from '../context/HandbuchContext';
import { EintragForm } from './EintragForm';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export const EintragListe: React.FC = () => {
  const { eintraege, deleteEintrag, kategorien, isAdmin } = useHandbuch();
  const { toast } = useToast();
  const [, setEditId] = useState<string | null>(null);
  const [selectedKategorie, setSelectedKategorie] = useState<string>('');
  const [selectedFehlermeldung, setSelectedFehlermeldung] = useState<string>('');
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const filteredEintraege = useMemo(() => {
    if (!selectedKategorie) return eintraege;
    return eintraege.filter(eintrag => eintrag && eintrag.kategorie === selectedKategorie);
  }, [eintraege, selectedKategorie, updateTrigger]);

  const fehlermeldungen = useMemo(() => {
    return [...new Set(filteredEintraege
      .filter(eintrag => eintrag && eintrag.fehlermeldung)
      .map(eintrag => eintrag.fehlermeldung)
    )];
  }, [filteredEintraege, updateTrigger]);

  const selectedEintrag = useMemo(() => {
    return filteredEintraege.find(eintrag => eintrag?.fehlermeldung === selectedFehlermeldung);
  }, [filteredEintraege, selectedFehlermeldung, updateTrigger]);

  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Select value={selectedKategorie} onValueChange={setSelectedKategorie}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Kategorie auswählen" />
          </SelectTrigger>
          <SelectContent>
            {kategorien.filter(Boolean).map(kat => (
              <SelectItem key={kat} value={kat}>{kat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedFehlermeldung} onValueChange={setSelectedFehlermeldung}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Fehlermeldung auswählen" />
          </SelectTrigger>
          <SelectContent>
            {fehlermeldungen.map(fehler => (
              <SelectItem key={fehler} value={fehler}>{fehler}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEintrag && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedEintrag.fehlermeldung}</CardTitle>
            <CardDescription>{selectedEintrag.kategorie}</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Beschreibung:</strong> {selectedEintrag.beschreibung}</p>
            <p><strong>Lösung:</strong> {selectedEintrag.loesung}</p>
          </CardContent>
          {isAdmin && (
            <CardFooter className="space-x-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setEditId(selectedEintrag.id)}>Bearbeiten</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Eintrag bearbeiten</DialogTitle>
                    <DialogDescription>
                      Ändern Sie die Details des Eintrags und klicken Sie auf &apos;Aktualisieren&apos;.
                    </DialogDescription>
                  </DialogHeader>
                  <EintragForm editId={selectedEintrag.id} onSubmit={() => {
                    setEditId(null);
                    setUpdateTrigger(prev => prev + 1);
                  }} />
                </DialogContent>
              </Dialog>
              <Button 
                variant="destructive" 
                onClick={async () => {
                  await deleteEintrag(selectedEintrag.id);
                  toast({
                    title: "Eintrag gelöscht",
                    description: "Der Eintrag wurde erfolgreich gelöscht.",
                  });
                  setSelectedFehlermeldung('');
                }}
              >
                Löschen
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
};
