import React, { useState, useEffect } from 'react';
import { IntroHero } from './components/IntroHero';
import { ConsoleStage } from './components/ConsoleStage';
import { FallingParticles } from './components/FallingParticles';

const STORAGE_KEY = 'portfolio_console_display_name';

export default function App() {
  const [displayName, setDisplayName] = useState<string>('Bilal');

  // Load locally saved display name on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim()) {
        setDisplayName(saved.trim());
      }
    } catch {
      // Local storage may be restricted in sandboxes
    }
  }, []);

  const handleUpdateName = (newName: string) => {
    const trimmed = newName.trim() || 'Bilal';
    setDisplayName(trimmed);
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="min-h-screen bg-[#111113] text-[#EDEDED] flex flex-col items-center justify-start selection:bg-pink-500/20 selection:text-pink-400 relative overflow-hidden">
      <FallingParticles />
      <main className="w-full flex flex-col items-center pt-3 sm:pt-5 pb-2 sm:pb-4 relative z-10">
        <IntroHero
          displayName={displayName}
          onUpdateName={handleUpdateName}
        />
        <ConsoleStage displayName={displayName} />
      </main>
    </div>
  );
}
