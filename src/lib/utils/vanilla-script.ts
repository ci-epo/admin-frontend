/**
 * Pont vers les scripts vanilla du thème (public/assets) : chargement unique
 * d'un <script> et attente d'un global. Utilisé par les wrappers React
 * (modèle : `AppCalendar`).
 */

const scriptPromises = new Map<string, Promise<void>>();

export function loadScriptOnce(src: string): Promise<void> {
  const cached = scriptPromises.get(src);
  if (cached) return cached;

  const promise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
  scriptPromises.set(src, promise);
  return promise;
}

/** Oublie un script déjà chargé pour que le prochain `loadScriptOnce` le recharge. */
export function forgetScript(src: string): void {
  scriptPromises.delete(src);
}

export function waitForGlobal(name: string, timeoutMs = 5000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if ((window as unknown as Record<string, unknown>)[name] !== undefined) {
        resolve();
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`${name} global not available`));
        return;
      }
      window.setTimeout(tick, 30);
    };
    tick();
  });
}
