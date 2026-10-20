import type { GiftConfig } from '@/lib/types';

/* Anniversary gift for Dana. This is the only file you edit for a new gift.
   Search for EDIT: those are the placeholders to personalize before you send it.
   Photos go in public/photos/ and are referenced by file name only, e.g. img: 'us.jpg'. */
const config: GiftConfig = {
  name: 'Dana',

  // EDIT: how many years you have been together. Counts up on the second page.
  age: 2,
  from: '',

  // 'flower' = pick the petals (every petal says "I love you", the last says "I always love you").
  // Use 'balloons' for the original pop-the-balloons game.
  game: 'flower',

  letter: [
    'Dana,',
    '',
    'Happy anniversary. A card was never going to be big enough, so I built you this.',
    '',
    'Thank you for the way you show up for me, for the way you make ordinary days feel lighter, and for making home feel like a person instead of a place.',
    '',
    'Choosing you is the easiest decision I have ever made, and I choose you again today.',
    '',
    'Swipe through some of our favorite moments, pick the petals, then make a wish.',
    '',
    'I love you.',
    'YOUR NAME', // EDIT
  ],

  // EDIT: rename these to real memories. Put photos in public/photos/ and use img: 'file.jpg'.
  memories: [
    { title: 'The day we met', art: 'spark', tint: ['#FF4F8B', '#FFB36B'] },
    { title: 'Our everyday favorite', art: 'sun', tint: ['#B48CFF', '#FF4F8B'] },
    { title: 'That trip we still talk about', art: 'wave', tint: ['#FFE27A', '#FF7AA8'] },
    { title: 'The day you said yes', art: 'spark', tint: ['#8FA8FF', '#B48CFF'] },
  ],

  polaroidImg: '', // EDIT: e.g. 'us.jpg', the photo that appears after the last petal
  polaroidCaption: 'Us, always',
  secret: 'Secret unlocked: one night, one plan, all yours. You choose, I follow.',
  wish: 'Whatever you wished for, I hope I get to be part of it.',
  finale: 'Thank you for choosing me. I cannot wait to spend forever with you.',

  // Personal gift, so no "Made with Linky" badge.
  footerTitle: '',
  footerLine: '',

  text: {
    pageTitle: 'Happy anniversary, Dana',
    giftTitle: 'Happy anniversary,',
    heroLine1: 'Happy',
    heroLine2: 'Anniversary',
    fromLine: 'years with you, and forever still to come',
    letterTitle: 'A letter for my fiancée',
    gameTitle: 'Pick the petals',
    petalHint: 'Tap a petal',
    petalLine: 'I love you', // shown for every petal
    finalLine: 'I always love you', // shown when the last petal is gone
    leftWord: 'petals left',
    allPopped: 'All picked',
    wishTitle: 'Make a wish for us',
    finTitle: 'Happy anniversary,',
  },
};

export default config;
