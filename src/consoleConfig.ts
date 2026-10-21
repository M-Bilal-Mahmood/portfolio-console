/**
 * Portfolio Console Hardware Configuration
 * 
 * Coordinate System & Calibration:
 * - Reference dimensions: 1536 x 1024 (width x height)
 * - Position formula:
 *     Left = (centreX - width / 2) / 1536 * 100%
 *     Top  = (centreY - height / 2) / 1024 * 100%
 * - All keys and interactive overlays scale proportionally with the 1536/1024 container aspect ratio.
 */

export type SectionId = 'selected-work' | 'about' | 'process' | 'services' | 'contact';

export interface ConsoleKey {
  id: string;
  letter: string;
  caption: string;
  ariaLabel: string;
  left: string;
  top: string;
  width: string;
  height: string;
  faceColor: string;
  baseColor: string;
  textColor: string;
  section: SectionId;
  screenTitle: string;
  screenDescription: string;
  shortcut: string;
}

export interface WelcomeConfig {
  defaultName: string;
  titleTemplate: (name: string) => string;
  description: string;
}

export interface ImageConfig {
  width: number;
  height: number;
  path: string;
  alt: string;
}

export const IMAGE: ImageConfig = {
  width: 1536,
  height: 1024,
  path: '/assets/device-reference.png',
  alt: 'The Portfolio Console Hardware Enclosure',
};

export const WELCOME: WelcomeConfig = {
  defaultName: 'Bilal',
  titleTemplate: (name: string) => `${name}'s portfolio`,
  description: 'A curious mind. A world of possibilities.',
};

export const KEYS: ConsoleKey[] = [
  {
    id: 'key-p',
    letter: 'P',
    caption: 'SELECTED WORK',
    ariaLabel: 'Key P: Selected Work',
    left: '20.60%',
    top: '51.87%',
    width: '10.16%',
    height: '12.70%',
    faceColor: '#EC6426',
    baseColor: '#AD4017',
    textColor: '#66271B',
    section: 'selected-work',
    screenTitle: 'Selected Work',
    screenDescription: 'Selected website and identity concepts',
    shortcut: 'p',
  },
  {
    id: 'key-o-about',
    letter: 'O',
    caption: 'ABOUT ME',
    ariaLabel: 'Key O: About Me',
    left: '32.98%',
    top: '50.89%',
    width: '10.16%',
    height: '12.70%',
    faceColor: '#F8A91F',
    baseColor: '#BC7512',
    textColor: '#66271B',
    section: 'about',
    screenTitle: 'About Me',
    screenDescription: 'Welcome to my portfolio. A little personality. A lot of possibility.',
    shortcut: 'o',
  },
  {
    id: 'key-r',
    letter: 'R',
    caption: 'MY PROCESS',
    ariaLabel: 'Key R: My Process',
    left: '45.53%',
    top: '49.82%',
    width: '10.16%',
    height: '12.70%',
    faceColor: '#FDE3CF',
    baseColor: '#CAA58A',
    textColor: '#66271B',
    section: 'process',
    screenTitle: 'My Process',
    screenDescription: 'We start with a conversation, shape the design together, then build and launch your website.',
    shortcut: 'r',
  },
  {
    id: 'key-t',
    letter: 'T',
    caption: 'WHAT I DO',
    ariaLabel: 'Key T: What I Do',
    left: '57.95%',
    top: '48.64%',
    width: '10.16%',
    height: '12.70%',
    faceColor: '#2E573A',
    baseColor: '#193A23',
    textColor: '#FDE3CF',
    section: 'services',
    screenTitle: 'What I Do',
    screenDescription: 'Thoughtful design, clear communication, and a website built around your business.',
    shortcut: 't',
  },
  {
    id: 'key-f',
    letter: 'F',
    caption: 'EXPLORE',
    ariaLabel: 'Key F: Explore',
    left: '70.51%',
    top: '47.87%',
    width: '10.16%',
    height: '12.70%',
    faceColor: '#72AC43',
    baseColor: '#487A26',
    textColor: '#66271B',
    section: 'selected-work',
    screenTitle: 'Explore',
    screenDescription: 'Selected website and identity concepts',
    shortcut: 'f',
  },
  {
    id: 'key-o-lower1',
    letter: 'O',
    caption: 'A LITTLE / ABOUT ME',
    ariaLabel: 'Key O: A Little About Me',
    left: '21.12%',
    top: '70.49%',
    width: '6.38%',
    height: '10.55%',
    faceColor: '#E4A5CA',
    baseColor: '#B76F9B',
    textColor: '#66271B',
    section: 'about',
    screenTitle: 'A Little About Me',
    screenDescription: 'Welcome to my portfolio. A little personality. A lot of possibility.',
    shortcut: 'shift+o',
  },
  {
    id: 'key-l',
    letter: 'L',
    caption: 'THE / PROCESS',
    ariaLabel: 'Key L: The Process',
    left: '28.69%',
    top: '69.71%',
    width: '6.38%',
    height: '10.55%',
    faceColor: '#66271B',
    baseColor: '#40150E',
    textColor: '#FDE3CF',
    section: 'process',
    screenTitle: 'The Process',
    screenDescription: 'We start with a conversation, shape the design together, then build and launch your website.',
    shortcut: 'l',
  },
  {
    id: 'key-i',
    letter: 'I',
    caption: 'MY / APPROACH',
    ariaLabel: 'Key I: My Approach',
    left: '36.50%',
    top: '69.32%',
    width: '6.38%',
    height: '10.55%',
    faceColor: '#EC6426',
    baseColor: '#AD4017',
    textColor: '#66271B',
    section: 'services',
    screenTitle: 'My Approach',
    screenDescription: 'Thoughtful design, clear communication, and a website built around your business.',
    shortcut: 'i',
  },
  {
    id: 'key-o-lower2',
    letter: 'O',
    caption: 'SAY / HELLO',
    ariaLabel: 'Key O: Say Hello',
    left: '44.01%',
    top: '68.74%',
    width: '6.38%',
    height: '10.55%',
    faceColor: '#F8A91F',
    baseColor: '#BC7512',
    textColor: '#66271B',
    section: 'contact',
    screenTitle: 'Say Hello',
    screenDescription: 'Have a project in mind, a half-formed idea, or just want to say hi?',
    shortcut: 'h',
  },
  {
    id: 'key-star',
    letter: '★',
    caption: 'PORTFOLIO',
    ariaLabel: 'Portfolio Star Key',
    left: '51.68%',
    top: '68.35%',
    width: '6.38%',
    height: '10.55%',
    faceColor: '#E4A5CA',
    baseColor: '#B76F9B',
    textColor: '#66271B',
    section: 'selected-work',
    screenTitle: 'Explore my portfolio',
    screenDescription: 'Selected website and identity concepts',
    shortcut: '*',
  },
  {
    id: 'key-contact-bar',
    letter: '↵',
    caption: "LET'S TALK",
    ariaLabel: 'Return Key: Let\'s Talk',
    left: '60.22%',
    top: '66.29%',
    width: '25.65%',
    height: '11.34%',
    faceColor: '#252525',
    baseColor: '#101010',
    textColor: '#FFFFFF',
    section: 'contact',
    screenTitle: "Let's talk",
    screenDescription: 'Have a project in mind, a half-formed idea, or just want to say hi?',
    shortcut: 'enter',
  },
];
