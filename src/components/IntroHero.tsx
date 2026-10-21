import React, { useState, useEffect, useRef } from 'react';
import { Pencil, Check } from 'lucide-react';

interface IntroHeroProps {
  displayName: string;
  onUpdateName: (name: string) => void;
}

export const IntroHero: React.FC<IntroHeroProps> = ({
  displayName,
  onUpdateName,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(displayName);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempName(displayName);
  }, [displayName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = tempName.trim();
    if (trimmed.length > 0) {
      onUpdateName(trimmed);
    } else {
      setTempName('Bilal');
      onUpdateName('Bilal');
    }
    setIsEditing(false);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempName(displayName);
      setIsEditing(false);
    }
  };

  return (
    <section className="pt-1 sm:pt-2 pb-1 sm:pb-2 text-center relative z-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Headline with Editable Display Name */}
        <h1 className="text-[clamp(32px,4vw,52px)] font-extrabold tracking-tight text-[#EDEDED] leading-tight">
          <span>Hey, this is </span>
          {isEditing ? (
            <span className="inline-flex items-center align-baseline">
              <input
                ref={inputRef}
                type="text"
                aria-label="Display name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                maxLength={24}
                className="bg-[#18181c] text-pink-500 border-b-2 border-pink-500 px-1 py-0 outline-none font-extrabold tracking-tight text-center inline-block w-auto min-w-[120px] max-w-[320px] rounded shadow-sm focus:ring-2 focus:ring-pink-400"
                style={{ width: `${Math.max(tempName.length * 0.75, 4.5)}ch` }}
              />
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="ml-2 text-xs text-pink-400 hover:text-pink-300 p-1 focus:outline-none focus:ring-2 focus:ring-pink-400 rounded cursor-pointer"
                title="Save name"
                aria-label="Save name"
              >
                <Check className="w-5 h-5" />
              </button>
            </span>
          ) : (
            <span className="group relative inline-flex items-center align-baseline">
              <span
                onClick={handleStartEdit}
                className="text-pink-500 hover:text-pink-400 transition-colors cursor-pointer underline decoration-pink-500/40 hover:decoration-pink-400 underline-offset-8"
              >
                {displayName}
              </span>
              <button
                type="button"
                onClick={handleStartEdit}
                aria-label="Edit display name"
                className="inline-flex items-center justify-center p-1 ml-1 text-pink-400/80 hover:text-pink-400 transition-colors rounded focus:outline-none focus:ring-2 focus:ring-pink-400 cursor-pointer"
                title="Edit display name"
              >
                <Pencil className="w-4 h-4 mb-0.5" />
              </button>
              {showSavedFeedback && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#18181c] text-pink-400 border border-pink-500/30 whitespace-nowrap shadow-md">
                  saved locally
                </span>
              )}
            </span>
          )}
        </h1>
      </div>
    </section>
  );
};
