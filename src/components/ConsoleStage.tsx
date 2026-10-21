import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ConsoleKey,
  SectionId,
  KEYS,
  WELCOME,
  IMAGE,
} from '../consoleConfig';

interface ScreenDisplayProps {
  activeKey: ConsoleKey | null;
  displayName: string;
}

const ScreenDisplay: React.FC<ScreenDisplayProps> = ({ activeKey, displayName }) => {
  const [displayed, setDisplayed] = useState('');
  const [status, setStatus] = useState<'TYPING' | 'READY'>('READY');

  const welcomeTitle = WELCOME.titleTemplate(displayName);
  const targetTitle = activeKey ? activeKey.screenTitle : welcomeTitle;
  const description = activeKey ? activeKey.screenDescription : WELCOME.description;

  const delay = targetTitle === welcomeTitle ? 350 : 0;
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayed(targetTitle);
      setStatus('READY');
      return;
    }

    setStatus('TYPING');
    setDisplayed('');

    let timer: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    timer = setTimeout(() => {
      let i = 0;
      interval = setInterval(() => {
        if (i < targetTitle.length) {
          setDisplayed(targetTitle.substring(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
          setStatus('READY');
        }
      }, 110);
    }, delay);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [targetTitle, delay, prefersReducedMotion]);

  return (
    <div
      className="absolute overflow-hidden"
      style={{
        left: '21.8%',
        top: '17.9%',
        width: '56.9%',
        height: '15.3%',
        transform: 'rotate(-3deg) skewX(5deg)',
        fontFamily: '"Courier New", Courier, monospace',
      }}
    >
      {/* Metadata row */}
      <div 
        className="absolute flex justify-between items-center text-amber-500"
        style={{
          top: '10%',
          left: '4%',
          right: '4%',
          fontSize: '0.8cqw',
          letterSpacing: '0.08em',
        }}
      >
        <span>{displayName.toUpperCase()} / CREATIVE INDEX</span>
        <span>{status}</span>
      </div>

      {/* Main title */}
      <div 
        aria-label={targetTitle}
        className="absolute text-[#FDE3CF] font-bold whitespace-nowrap flex items-center"
        style={{
          top: '32%',
          left: '4%',
          right: '4%',
          fontSize: 'clamp(2.2cqw, 3.35cqw, 3.35cqw)',
          lineHeight: '1.1',
          textShadow: '0 0 0.6cqw rgba(253,227,207,0.25)',
          minHeight: '3.8cqw',
        }}
      >
        {prefersReducedMotion ? (
          <span className="overflow-hidden text-ellipsis">{targetTitle}</span>
        ) : status === 'TYPING' && displayed === '' ? (
          <span className="inline-block bg-amber-500" style={{ width: '0.25cqw', height: '3.35cqw' }} />
        ) : (
          <>
            <span className="overflow-hidden text-ellipsis">{displayed || targetTitle}</span>
            <span
              className={`inline-block bg-amber-500 ml-[0.1cqw] ${status === 'READY' ? 'animate-pulse' : ''}`}
              style={{ width: '0.25cqw', height: '3.35cqw' }}
            />
          </>
        )}
      </div>

      {/* Description */}
      <div 
        className="absolute text-[#9CA3AF] whitespace-nowrap overflow-hidden text-ellipsis"
        style={{
          top: '72%',
          left: '4%',
          right: '4%',
          fontSize: '1.05cqw',
          lineHeight: '1.3',
        }}
      >
        {description}
      </div>
    </div>
  );
};

export interface ConsoleStageProps {
  displayName?: string;
  keys?: ConsoleKey[];
  imageSrc?: string;
  onSelect?: (key: ConsoleKey, section: SectionId) => void;
}

export const ConsoleStage: React.FC<ConsoleStageProps> = ({
  displayName: propDisplayName,
  keys = KEYS,
  imageSrc = IMAGE.path,
  onSelect,
}) => {
  const [internalName] = useState<string>(() => {
    try {
      return localStorage.getItem('portfolio_console_display_name') || WELCOME.defaultName;
    } catch {
      return WELCOME.defaultName;
    }
  });
  const displayName = propDisplayName || internalName;

  const [activeKeyId, setActiveKeyId] = useState<string | null>(null);
  const [pressedKeyId, setPressedKeyId] = useState<string | null>(null);
  const [waveActive, setWaveActive] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [noTransition, setNoTransition] = useState(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const isHoveredRef = useRef(false);
  const hasFocusRef = useRef(false);
  const isTouchModeRef = useRef(false);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const waveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const noTransitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeKey = keys.find((k) => k.id === activeKeyId) || null;

  // Monitor prefers-reduced-motion media query
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Cancel any running wave animation and clear idle timer
  const cancelWaveAndTimer = useCallback((forceNoTransition = false) => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (waveTimeoutRef.current) {
      clearTimeout(waveTimeoutRef.current);
      waveTimeoutRef.current = null;
    }
    setWaveActive(false);

    if (forceNoTransition) {
      setNoTransition(true);
      if (noTransitionTimerRef.current) clearTimeout(noTransitionTimerRef.current);
      noTransitionTimerRef.current = setTimeout(() => {
        setNoTransition(false);
      }, 50);
    }
  }, []);

  // Schedule the next idle wave (default 7 seconds)
  const startIdleTimer = useCallback((delay = 7000) => {
    if (prefersReducedMotion) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);

    idleTimerRef.current = setTimeout(() => {
      const isHidden = typeof document !== 'undefined' && document.visibilityState === 'hidden';
      const hasWindowFocus = typeof document !== 'undefined' && (typeof document.hasFocus === 'function' ? document.hasFocus() : true);
      const isInteracting = isHoveredRef.current || hasFocusRef.current || pressedKeyId !== null || activeKeyId !== null;

      if (!isHidden && hasWindowFocus && !isInteracting) {
        setWaveActive(true);
        const waveDuration = keys.length * 85 + 1100;
        waveTimeoutRef.current = setTimeout(() => {
          setWaveActive(false);
          startIdleTimer(7000);
        }, waveDuration);
      }
    }, delay);
  }, [prefersReducedMotion, pressedKeyId, activeKeyId, keys.length]);

  // Handle first paint and avoid unit flash or initial load jump
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsReady(true);
        startIdleTimer(7000);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (waveTimeoutRef.current) clearTimeout(waveTimeoutRef.current);
      if (noTransitionTimerRef.current) clearTimeout(noTransitionTimerRef.current);
    };
  }, [startIdleTimer]);

  // Handle tab visibility and window blur/focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        cancelWaveAndTimer(true);
        setPressedKeyId(null);
        setActiveKeyId(null);
        isHoveredRef.current = false;
      } else {
        cancelWaveAndTimer(true);
        if (!isHoveredRef.current && !hasFocusRef.current) {
          startIdleTimer(7000);
        }
      }
    };

    const handleWindowBlur = () => {
      cancelWaveAndTimer(true);
      setPressedKeyId(null);
      setActiveKeyId(null);
      isHoveredRef.current = false;
    };

    const handleWindowFocus = () => {
      cancelWaveAndTimer(true);
      if (!isHoveredRef.current && !hasFocusRef.current && document.visibilityState === 'visible') {
        startIdleTimer(7000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [cancelWaveAndTimer, startIdleTimer]);

  // Trigger key press with 120ms pressed look; onSelect called only on explicit action (click, tap, Enter/Space on focused key)
  const triggerPress = useCallback((key: ConsoleKey, isExplicitAction = false) => {
    cancelWaveAndTimer(false);
    setPressedKeyId(key.id);
    setActiveKeyId(key.id);

    // Call user-provided onSelect callback on explicit user action
    if (isExplicitAction && onSelect) {
      onSelect(key, key.section);
    }

    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      setPressedKeyId(null);
      if (!isHoveredRef.current && !hasFocusRef.current && document.visibilityState === 'visible') {
        startIdleTimer(7000);
      }
    }, 120);
  }, [cancelWaveAndTimer, onSelect, startIdleTimer]);

  // Track pointer types & dismiss active selection when tapping/clicking outside the keys
  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        isTouchModeRef.current = true;
      }
      const target = e.target as HTMLElement | null;
      const isKeycap = target?.closest('.keycap-button');
      if (!isKeycap) {
        setActiveKeyId(null);
        if (!isHoveredRef.current && !hasFocusRef.current && document.visibilityState === 'visible') {
          startIdleTimer(7000);
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        isTouchModeRef.current = false;
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [startIdleTimer]);

  // Hardware keyboard shortcuts (previews key and types to screen, does not trigger onSelect)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;

    const activeEl = document.activeElement;
    if (activeEl) {
      const tagName = activeEl.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || tagName === 'select' || activeEl.hasAttribute('contenteditable')) {
        return;
      }
    }

    const isActive = isHoveredRef.current || hasFocusRef.current;
    if (!isActive) return;

    const key = e.key.toLowerCase();
    let targetKey: ConsoleKey | undefined = undefined;

    if (['p', 'r', 't', 'f', 'l', 'i'].includes(key)) {
      targetKey = keys.find((k) => k.shortcut === key);
    } else if (key === 'o') {
      targetKey = e.shiftKey
        ? keys.find((k) => k.shortcut === 'shift+o')
        : keys.find((k) => k.shortcut === 'o');
    } else if (key === 'h') {
      targetKey = keys.find((k) => k.shortcut === 'h');
    } else if (e.key === 'Enter') {
      const isButtonOrLinkFocused = activeEl && (activeEl.tagName === 'BUTTON' || activeEl.tagName === 'A');
      if (!isButtonOrLinkFocused) {
        targetKey = keys.find((k) => k.shortcut === 'enter');
      }
    } else if (e.key === '*' || (e.shiftKey && e.key === '8')) {
      targetKey = keys.find((k) => k.shortcut === '*');
    }

    if (targetKey) {
      e.preventDefault();
      cancelWaveAndTimer(false);
      triggerPress(targetKey, false);
    }
  }, [cancelWaveAndTimer, keys, triggerPress]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <section 
      id="console-stage-section"
      className="w-full py-1 sm:py-2 relative z-10"
      onMouseEnter={() => {
        isHoveredRef.current = true;
        cancelWaveAndTimer(false);
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        setActiveKeyId(null);
        if (!hasFocusRef.current && document.visibilityState === 'visible') {
          startIdleTimer(7000);
        }
      }}
    >
      <div className="w-full flex justify-center px-2 sm:px-4">
        <div 
          className="mx-auto relative w-full"
          style={{ width: 'min(780px, 92vw, calc((100vh - 240px) * 1.5))' }}
        >
          <div 
            className={`console-device-wrapper relative w-full aspect-[1536/1024] bg-transparent flex items-center justify-center ${isReady ? 'is-ready' : ''} ${noTransition ? 'no-transition' : ''}`}
            onFocusCapture={() => {
              hasFocusRef.current = true;
              cancelWaveAndTimer(true);
            }}
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                hasFocusRef.current = false;
                setActiveKeyId(null);
                if (!isHoveredRef.current && document.visibilityState === 'visible') {
                  startIdleTimer(7000);
                }
              }
            }}
          >
            <img
              src={imageSrc}
              alt={IMAGE.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_1.5cqw_2.5cqw_rgba(0,0,0,0.45)]"
              loading="eager"
            />

            <ScreenDisplay activeKey={activeKey} displayName={displayName} />

            <div className="keys-overlay absolute inset-0 w-full h-full pointer-events-none">
              {keys.map((key) => {
                const isPressed = pressedKeyId === key.id;

                let animation = undefined;
                if (waveActive && !prefersReducedMotion && !isPressed) {
                  const index = keys.findIndex((k) => k.id === key.id);
                  const delayMs = index * 85;
                  animation = `keyPop 1.1s cubic-bezier(.22,1.5,.4,1) ${delayMs}ms 1`;
                }

                return (
                  <button
                    key={key.id}
                    aria-label={key.ariaLabel}
                    onMouseEnter={() => {
                      cancelWaveAndTimer(false);
                      setActiveKeyId(key.id);
                    }}
                    onFocus={() => {
                      cancelWaveAndTimer(false);
                      setActiveKeyId(key.id);
                    }}
                    onMouseLeave={() => {
                      if (!isTouchModeRef.current) {
                        setActiveKeyId(null);
                        if (!isHoveredRef.current && !hasFocusRef.current && document.visibilityState === 'visible') {
                          startIdleTimer(7000);
                        }
                      }
                    }}
                    onBlur={() => {
                      if (!isTouchModeRef.current) {
                        setActiveKeyId(null);
                        if (!isHoveredRef.current && !hasFocusRef.current && document.visibilityState === 'visible') {
                          startIdleTimer(7000);
                        }
                      }
                    }}
                    onPointerDown={() => {
                      cancelWaveAndTimer(false);
                    }}
                    onClick={() => triggerPress(key, true)}
                    style={{
                      position: 'absolute',
                      left: key.left,
                      top: key.top,
                      width: key.width,
                      height: key.height,
                      transform: 'rotate(-3.2deg) skewX(4.8deg)',
                    }}
                    className={`keycap-button pointer-events-auto ${isPressed ? 'is-pressed' : ''}`}
                  >
                    <div 
                      className="absolute inset-0 rounded-[0.7cqw] pointer-events-none"
                      style={{ 
                        backgroundColor: key.baseColor,
                        boxShadow: 'inset 0 0.35cqw 0.5cqw rgba(0,0,0,0.5), -0.2cqw 0.35cqw 0.35cqw 0px rgba(0,0,0,0.6)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '5%',
                        top: '0',
                        width: '90%',
                        height: '90%',
                        backgroundColor: isPressed ? adjustColor(key.faceColor, -20) : key.faceColor,
                        color: key.textColor,
                        fontFamily: '"Outfit", "Plus Jakarta Sans", sans-serif',
                        animation,
                        '--base-color': key.baseColor,
                      } as React.CSSProperties}
                      className={`keycap-face rounded-[0.7cqw] flex flex-col items-center justify-center border-t-[0.15cqw] border-white/20 overflow-hidden ${key.id === 'key-contact-bar' ? 'border-l-[0.1cqw] border-white/10 key-contact' : key.height === '12.70%' ? 'key-top-row' : 'key-lower-row'}`}
                    >
                      {key.id === 'key-contact-bar' ? (
                        <div className="keycap-contact-content flex items-center justify-center gap-[0.8cqw] px-[1cqw] w-full pointer-events-none">
                          <span className="keycap-letter leading-none">{key.letter}</span>
                          <span className="keycap-caption uppercase leading-none">{key.caption}</span>
                        </div>
                      ) : (
                        <>
                          <span className="keycap-letter leading-none pointer-events-none">{key.letter}</span>
                          {key.caption && (
                            <span 
                              className="keycap-caption uppercase mt-[0.2cqw] text-center leading-[1.05] px-[0.2cqw] pointer-events-none inline-block max-w-full"
                            >
                              {key.caption.split(' / ').map((line, i) => (
                                <React.Fragment key={i}>
                                  {line}
                                  {i < key.caption.split(' / ').length - 1 && <br />}
                                </React.Fragment>
                              ))}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

// Helper to darken face color when pressed
function adjustColor(hex: string, amount: number) {
  let useHash = false;
  if (hex.startsWith('#')) {
    hex = hex.slice(1);
    useHash = true;
  }
  let num = parseInt(hex, 16);
  let r = (num >> 16) + amount;
  let g = ((num >> 8) & 0x00ff) + amount;
  let b = (num & 0x0000ff) + amount;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return (useHash ? '#' : '') + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
