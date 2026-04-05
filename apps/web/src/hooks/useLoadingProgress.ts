import { useState, useCallback, useRef } from 'react';

export function useLoadingProgress() {
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const isMutationFinished = useRef(false);
  const onFinishCallback = useRef<(() => void) | null>(null);

  const startSaving = useCallback((duration = 1500) => {
    setIsSaving(true);
    setProgress(0);
    isMutationFinished.current = false;
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const nextProgress = Math.min(99, (elapsed / duration) * 100);
      
      setProgress(nextProgress);

      if (elapsed >= duration && isMutationFinished.current) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsSaving(false);
          if (onFinishCallback.current) onFinishCallback.current();
        }, 200);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const notifyMutationFinished = useCallback((callback: () => void) => {
    isMutationFinished.current = true;
    onFinishCallback.current = callback;
  }, []);

  const reset = useCallback(() => {
    setIsSaving(false);
    setProgress(0);
    isMutationFinished.current = false;
    onFinishCallback.current = null;
  }, []);

  return { isSaving, progress, startSaving, notifyMutationFinished, reset };
}
