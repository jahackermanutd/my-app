import { Letter, LetterTemplate } from './types';

// Letter state management
let letters: Letter[] = [];

export const initializeLetters = (initialLetters: Letter[]) => {
  letters = [...initialLetters];
};

export const getLetters = (): Letter[] => {
  return [...letters];
};

export const addLetter = (letter: Letter): void => {
  letters.push(letter);
  // Trigger storage update
  if (typeof window !== 'undefined') {
    localStorage.setItem('letters', JSON.stringify(letters));
    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('lettersUpdated', { detail: letters }));
  }
};

export const updateLetter = (id: string, updates: Partial<Letter>): void => {
  const index = letters.findIndex(l => l.id === id);
  if (index !== -1) {
    letters[index] = { ...letters[index], ...updates, updatedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem('letters', JSON.stringify(letters));
      window.dispatchEvent(new CustomEvent('lettersUpdated', { detail: letters }));
    }
  }
};

export const deleteLetter = (id: string): void => {
  letters = letters.filter(l => l.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem('letters', JSON.stringify(letters));
    window.dispatchEvent(new CustomEvent('lettersUpdated', { detail: letters }));
  }
};

export const getLetterById = (id: string): Letter | undefined => {
  return letters.find(l => l.id === id);
};

export const getUserLetters = (userId: string): Letter[] => {
  // In a real app, filter by actual user ownership
  return letters;
};
