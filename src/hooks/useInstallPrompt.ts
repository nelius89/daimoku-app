import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface UseInstallPromptReturn {
  canInstall: boolean;
  isIOS: boolean;
  install: () => Promise<void>;
}

export function useInstallPrompt(): UseInstallPromptReturn {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  // Already installed as standalone — never show
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;

  const isIOS =
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(navigator as Navigator & { standalone?: boolean }).standalone;

  useEffect(() => {
    if (isStandalone) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [isStandalone]);

  const install = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
  };

  const canInstall = !isStandalone && (prompt !== null || isIOS);

  return { canInstall, isIOS, install };
}
