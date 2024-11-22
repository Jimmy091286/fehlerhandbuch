import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type EintragType = {
  id: string;
  kategorie: string;
  fehlermeldung: string;
  beschreibung: string;
  loesung: string;
};

type HandbuchContextType = {
  eintraege: EintragType[];
  kategorien: string[];
  addEintrag: (eintrag: Omit<EintragType, 'id'>) => Promise<void>;
  updateEintrag: (id: string, eintrag: Omit<EintragType, 'id'>) => Promise<void>;
  addKategorie: (kategorie: string) => Promise<void>;
  deleteEintrag: (id: string) => Promise<void>;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: any;
};

const HandbuchContext = createContext<HandbuchContextType | undefined>(undefined);

export const HandbuchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [eintraege, setEintraege] = useState<EintragType[]>([]);
  const [kategorien, setKategorien] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsAdmin(session?.user?.email === 'admin@example.com');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    const { data: eintraegeData, error: eintraegeError } = await supabase
      .from('eintraege')
      .select('*');
    if (eintraegeError) console.error('Fehler beim Laden der Einträge:', eintraegeError);
    else setEintraege(eintraegeData);

    const { data: kategorienData, error: kategorienError } = await supabase
      .from('kategorien')
      .select('name');
    if (kategorienError) console.error('Fehler beim Laden der Kategorien:', kategorienError);
    else setKategorien(kategorienData.map(k => k.name));
  };

  const addEintrag = async (eintrag: Omit<EintragType, 'id'>) => {
    const { data, error } = await supabase
      .from('eintraege')
      .insert([eintrag])
      .single();
    if (error) console.error('Fehler beim Hinzufügen des Eintrags:', error);
    else setEintraege([...eintraege, data]);
  };

  const updateEintrag = async (id: string, updatedEintrag: Omit<EintragType, 'id'>) => {
    if (!id) {
      console.error('Ungültige ID beim Aktualisieren des Eintrags');
      return;
    }
    const { data, error } = await supabase
      .from('eintraege')
      .update(updatedEintrag)
      .eq('id', id)
      .single();
    if (error) {
      console.error('Fehler beim Aktualisieren des Eintrags:', error);
    } else if (data) {
      setEintraege(eintraege.map(eintrag => eintrag && eintrag.id === id ? data : eintrag));
    }
  };

  const addKategorie = async (kategorie: string) => {
    if (!kategorien.includes(kategorie)) {
      const { data, error } = await supabase
        .from('kategorien')
        .insert([{ name: kategorie }])
        .single();
      if (error) console.error('Fehler beim Hinzufügen der Kategorie:', error);
      else setKategorien([...kategorien, kategorie]);
    }
  };

  const deleteEintrag = async (id: string) => {
    if (!id) {
      console.error('Ungültige ID beim Löschen des Eintrags');
      return;
    }
    const { error } = await supabase
      .from('eintraege')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Fehler beim Löschen des Eintrags:', error);
    } else {
      setEintraege(eintraege.filter(eintrag => eintrag && eintrag.id !== id));
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Anmeldefehler:', error);
      return false;
    }
    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Abmeldefehler:', error);
    setIsAdmin(false);
  };

  return (
    <HandbuchContext.Provider value={{ 
      eintraege, 
      kategorien, 
      addEintrag, 
      updateEintrag, 
      addKategorie, 
      deleteEintrag,
      isAdmin,
      login,
      logout,
      user
    }}>
      {children}
    </HandbuchContext.Provider>
  );
};

export const useHandbuch = () => {
  const context = useContext(HandbuchContext);
  if (context === undefined) {
    throw new Error('useHandbuch must be used within a HandbuchProvider');
  }
  return context;
};

