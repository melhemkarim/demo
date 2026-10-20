'use client';

import { useEffect, useRef } from 'react';
import { GIFT_HTML } from './giftHtml';
import type { RuntimeConfig } from '@/lib/types';

declare global {
  interface Window {
    initLinkyGift?: (config: RuntimeConfig) => () => void;
  }
}

const scriptCache = new Map<string, Promise<void>>();
function loadScript(src: string): Promise<void> {
  const hit = scriptCache.get(src);
  if (hit) return hit;
  const p = new Promise<void>((resolve, reject) => {
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error('Failed to load ' + src));
    document.body.appendChild(el);
  });
  scriptCache.set(src, p);
  return p;
}

export default function GiftExperience({ config }: { config: RuntimeConfig }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    (async () => {
      // Order matters: three and gsap define globals that main.js uses.
      await loadScript('/vendor/three.min.js');
      await loadScript('/vendor/gsap.min.js');
      await loadScript('/gift/main.js');
      if (cancelled || !window.initLinkyGift) return;
      destroy = window.initLinkyGift(config);
    })().catch(console.error);

    return () => {
      cancelled = true;
      destroy?.();
      // main.js edits the DOM directly, so restore pristine markup (fresh canvas included) in case this remounts.
      el.innerHTML = GIFT_HTML;
    };
  }, [config]);

  return <div ref={root} dangerouslySetInnerHTML={{ __html: GIFT_HTML }} />;
}
