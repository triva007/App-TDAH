import { Task, SubTask } from './types';

export const mockAiBreakdown = (taskTitle: string): SubTask[] => {
  const lowerTitle = taskTitle.toLowerCase();
  
  if (lowerTitle.includes('compta') || lowerTitle.includes('facture')) {
    return [
      { id: crypto.randomUUID(), title: 'Ouvrir le dossier de facturation', completed: false },
      { id: crypto.randomUUID(), title: 'Trier les factures du mois', completed: false },
      { id: crypto.randomUUID(), title: 'Saisir les dépenses', completed: false },
      { id: crypto.randomUUID(), title: 'Envoyer au comptable', completed: false },
    ];
  }
  
  if (lowerTitle.includes('mail') || lowerTitle.includes('email')) {
    return [
      { id: crypto.randomUUID(), title: 'Ouvrir la boîte de réception', completed: false },
      { id: crypto.randomUUID(), title: 'Archiver les spams', completed: false },
      { id: crypto.randomUUID(), title: 'Répondre aux urgences (max 3)', completed: false },
    ];
  }

  // Generic breakdown
  return [
    { id: crypto.randomUUID(), title: "Préparer l'espace de travail", completed: false },
    { id: crypto.randomUUID(), title: 'Faire la première action de 2 minutes', completed: false },
    { id: crypto.randomUUID(), title: 'Avancer sur le cœur de la tâche', completed: false },
    { id: crypto.randomUUID(), title: 'Finaliser et valider', completed: false },
  ];
};
