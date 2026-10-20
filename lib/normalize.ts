import type { GiftConfig, RuntimeConfig, Art } from './types';

const ARTS: Art[] = ['sun', 'slice', 'wave', 'spark'];
const TINTS: [string, string][] = [
  ['#FF4F8B', '#FFB36B'],
  ['#8FA8FF', '#B48CFF'],
  ['#FFE27A', '#FF7AA8'],
  ['#B48CFF', '#FF4F8B'],
];

/** 'us.jpg' -> '/photos/us.jpg'. Full URLs and absolute paths pass through. */
export function resolveImg(img?: string): string {
  if (!img) return '';
  const url = /^(https?:)?\/\//.test(img) || img.startsWith('/') ? img : `/photos/${img}`;
  // main.js puts this inside css url(...), so escape the characters that would break out of it.
  return encodeURI(url).replace(/[()']/g, (c) => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

export function normalize(c: GiftConfig): RuntimeConfig {
  return {
    ...c,
    polaroidImg: resolveImg(c.polaroidImg),
    text: c.text ?? {},
    game: c.game ?? 'balloons',
    memories: c.memories.map((m, i) => ({
      title: m.title,
      img: resolveImg(m.img),
      art: m.art ?? ARTS[i % ARTS.length],
      tint: m.tint ?? TINTS[i % TINTS.length],
    })),
  };
}
