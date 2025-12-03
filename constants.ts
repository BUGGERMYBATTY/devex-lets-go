
import type { Layout, ColorScheme, GoogleFont, Section } from './types';

export const LAYOUTS: Layout[] = [
  { id: 1, name: 'Meme Star', thumbnail: 'https://picsum.photos/seed/layout1/200/120' },
];

export const COLOR_SCHEMES: ColorScheme[] = [
  { 
    name: 'Meme Pink', 
    colors: { bg: 'bg-[#f000ff]', primary: 'bg-[#f000ff]', secondary: 'bg-[#d900e6]', accent: 'text-white', textPrimary: 'text-white', textSecondary: 'text-white' } 
  },
  { 
    name: 'Cyberpunk', 
    colors: { bg: 'bg-gray-900', primary: 'bg-indigo-900', secondary: 'bg-gray-800', accent: 'text-cyan-400', textPrimary: 'text-white', textSecondary: 'text-gray-400' } 
  },
  { 
    name: 'Solar', 
    colors: { bg: 'bg-slate-800', primary: 'bg-amber-600', secondary: 'bg-slate-700', accent: 'text-amber-300', textPrimary: 'text-white', textSecondary: 'text-slate-300' } 
  },
  {
    name: 'Aquatic',
    colors: { bg: 'bg-sky-900', primary: 'bg-teal-500', secondary: 'bg-sky-800', accent: 'text-emerald-300', textPrimary: 'text-white', textSecondary: 'text-sky-200' }
  },
];

export const GOOGLE_FONTS: GoogleFont[] = [
  { name: 'Chewy', import: `@import url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');`, family: "'Chewy', cursive" },
  { name: 'Bangers', import: `@import url('https://fonts.googleapis.com/css2?family=Bangers&display=swap');`, family: "'Bangers', cursive" },
  { name: 'Luckiest Guy', import: `@import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap');`, family: "'Luckiest Guy', cursive" },
  { name: 'Titan One', import: `@import url('https://fonts.googleapis.com/css2?family=Titan+One&display=swap');`, family: "'Titan One', cursive" },
  { name: 'Permanent Marker', import: `@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap');`, family: "'Permanent Marker', cursive" },
  { name: 'Comic Neue', import: `@import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&display=swap');`, family: "'Comic Neue', cursive" },
  { name: 'VT323', import: `@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');`, family: "'VT323', monospace" },
  { name: 'Fredoka One', import: `@import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');`, family: "'Fredoka One', cursive" },
  { name: 'Roboto', import: `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');`, family: "'Roboto', sans-serif" },
];

export const INITIAL_SECTIONS: Section[] = [
  {
    id: 'hero',
    component: 'Hero',
    title: 'Hero',
    content: {
      heading: 'SOLIGATOR',
      paragraph: 'SOLIGATOR, the lazy alligator. Reptile meme on SOL chain.',
    },
  },
  {
    id: 'about',
    component: 'About',
    title: 'About',
    content: {
      heading: 'About',
      paragraph: 'SOLIGATOR is a fierce yet laid-back croc, lounging by the swamp, waiting for his next big opportunity to strike and dominate the crypto waters.',
      navTitle: 'about',
    },
  },
  {
    id: 'gallery', // Using Gallery component structure for the 'Buy' section visually
    component: 'Gallery',
    title: 'Buy',
    content: {
      heading: 'Buy $SOLIGATOR',
      paragraph: 'Create your Phantom wallet and get your first $SOLIGATOR from dexscreener.com',
      navTitle: 'buy $MEME',
    },
  },
  {
    id: 'tokenomics',
    component: 'Tokenomics',
    title: 'Tokenomics',
    content: {
      heading: 'Tokenomics',
      items: ['LP Burnt', 'Contract renounced', '100% Liquidity'],
      navTitle: 'tokenomics',
    },
  },
  {
    id: 'socials',
    component: 'Socials',
    title: 'Socials',
    content: {
      heading: 'Join the community',
      socialLinks: {
        twitter: 'https://twitter.com',
        telegram: 'https://t.me',
        discord: '',
      }
    },
  },
];
