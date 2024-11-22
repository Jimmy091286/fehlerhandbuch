"use client"

import React from 'react';
import { HandbuchProvider } from '../context/HandbuchContext';
import { EintragForm } from '../components/EintragForm';
import { KategorieForm } from '../components/KategorieForm';
import { EintragListe } from '../components/EintragListe';
import { LoginForm } from '../components/LoginForm';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useHandbuch } from '../context/HandbuchContext';
import { Toaster } from "@/components/ui/toaster"

function AdminSection() {
  return (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Neue Kategorie hinzufügen</h2>
        <KategorieForm />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Neuen Eintrag hinzufügen</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Neuen Eintrag hinzufügen</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Eintrag hinzufügen</DialogTitle>
              <DialogDescription>
                Füllen Sie die Details für den neuen Eintrag aus und klicken Sie auf &apos;Hinzufügen&apos;.
              </DialogDescription>
            </DialogHeader>
            <EintragForm onSubmit={() => {}} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function MainContent() {
  const { isAdmin } = useHandbuch();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Fehlerhandbuch</h1>
      
      <div className="mb-4">
        <LoginForm />
      </div>

      {isAdmin && <AdminSection />}

      <div>
        <h2 className="text-xl font-semibold mb-2">Einträge suchen</h2>
        <EintragListe />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <HandbuchProvider>
      <MainContent />
      <Toaster />
    </HandbuchProvider>
  );
}

