export type Art = 'sun' | 'slice' | 'wave' | 'spark';

export type Memory = {
  title: string;
  /** File name inside public/photos/ (e.g. 'trip.jpg'), or a full https URL. Omit for the colored placeholder. */
  img?: string;
  /** Placeholder drawing, only used when img is empty. */
  art?: Art;
  /** Placeholder gradient colors, only used when img is empty. */
  tint?: [string, string];
};

/** Optional wording overrides. Anything left out keeps the birthday default. */
export type GiftText = Partial<Record<
  | 'pageTitle' | 'giftTitle' | 'holdHint' | 'keepHolding'
  | 'heroLine1' | 'heroLine2' | 'fromLine'
  | 'letterTitle' | 'deckTitle' | 'deckHint'
  | 'gameTitle' | 'leftWord' | 'allPopped'
  | 'petalHint' | 'petalLine' | 'finalLine'
  | 'wishTitle' | 'blowButton' | 'finTitle' | 'replay' | 'next',
  string
>>;

export type GiftConfig = {
  name: string;
  age: number;
  from: string;
  /** One string per line. Use '' for a blank line. */
  letter: string[];
  /** 3 to 6 cards work best. */
  memories: Memory[];
  /** Photo that drops in after all balloons are popped. */
  polaroidImg?: string;
  polaroidCaption: string;
  secret: string;
  wish: string;
  finale: string;
  /** Badge on the last page. Set both to '' to hide it. */
  footerTitle: string;
  footerLine: string;
  /** 'balloons' (default) or 'flower': pick the petals, each says "I love you", the last says "I always love you". */
  game?: 'balloons' | 'flower';
  /** Change the wording (e.g. for a love gift instead of a birthday). */
  text?: GiftText;
};

/** What main.js receives: images already turned into real URLs, defaults filled in. */
export type RuntimeConfig = Required<Omit<GiftConfig, 'memories' | 'text'>> & {
  memories: Required<Memory>[];
  text: GiftText;
};
