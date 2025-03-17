'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Title } from '@/lib/definitions';

type TitlesContextType = {
  titles: Title[];
  setTitles: React.Dispatch<React.SetStateAction<Title[]>>;
  updateTitle: (id: string, updatedFields: Partial<Title>) => void;
};

const TitlesContext = createContext<TitlesContextType | undefined>(undefined);

export const TitlesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [titles, setTitles] = useState<Title[]>([]);

  const updateTitle = (id: string, updatedFields: Partial<Title>) => {
    setTitles((prevTitles) =>
      prevTitles.map((title) =>
        title.id === id ? { ...title, ...updatedFields } : title
      )
    );
  };

  return (
    <TitlesContext.Provider value={{ titles, setTitles, updateTitle }}>
      {children}
    </TitlesContext.Provider>
  );
};

export const useTitles = () => {
  const context = useContext(TitlesContext);
  if (context === undefined) {
    throw new Error('useTitles must be used within a TitlesProvider');
  }
  return context;
};
