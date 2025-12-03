
export type AppStep = 'DASHBOARD' | 'GENERATE' | 'BUILD';

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  createdAt: number;
  updatedAt: number;
  // Saved State
  layoutId: number; // Store ID instead of full object to save space
  colorSchemeId: string; // Store name/ID
  fontName: string;
  customColors: CustomColors;
  sections: Section[];
  generatedImages: string[];
  prompt: string;
}

export interface Section {
  id: string;
  title: string;
  component: 'Hero' | 'About' | 'Tokenomics' | 'Gallery' | 'Roadmap' | 'Socials';
  content: {
    heading?: string;
    paragraph?: string;
    items?: string[];
    navTitle?: string;
    socialLinks?: {
      twitter: string;
      telegram: string;
      discord: string;
    };
    customFontSizes?: {
        heading?: string; // e.g. "4rem"
        paragraph?: string; // e.g. "1.5rem"
    };
  };
}

export interface Layout {
  id: number;
  name: string;
  thumbnail: string;
}

export interface ColorScheme {
  name: string;
  colors: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
    textPrimary: string;
    textSecondary: string;
  };
}

export interface CustomColors {
  background?: string;
  backgroundSecondary?: string; // For 2-tone patterns
  backgroundPattern?: 'solid' | 'sunburst' | 'bubbles' | 'hypno' | 'stripes' | 'checker';
  actionButtonBg?: string;
  actionButtonText?: string;
  cardBg?: string;
  cardText?: string;
  cardBorder?: string;
  cardButtonBg?: string;
}

export interface GoogleFont {
  name: string;
  import: string;
  family: string;
}

// Wallet Types
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
    };
    solflare?: {
      isSolflare?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect: () => Promise<void>;
    };
  }
}
