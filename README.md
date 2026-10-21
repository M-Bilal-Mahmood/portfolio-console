# Portfolio Console

An interactive mechanical keyboard portfolio component built with React and TypeScript. Real HTML keycaps sit over a case image. Hover, focus, click or press the matching key on your keyboard, and the terminal screen types out that key's title.

Live demo: https://portfolio-console-six.vercel.app

## Features

- Keycaps placed over the image using percentages of a 1536 x 1024 coordinate system, so the keys, screen and image scale together
- Typing terminal screen with a single controller, so old typing is always cancelled
- Mouse, touch, keyboard focus and physical keyboard shortcuts
- Spring-style key motion with an idle wave
- Respects reduced-motion settings
- Editable display name, saved in the browser
- All keys, colours, positions and text in one config file

## Run it

```bash
npm install
npm run dev
```

Needs Node 20.19 or newer.

## Use the component

```tsx
import { ConsoleStage } from './components/ConsoleStage';

<ConsoleStage
  displayName="Your name"
  onSelect={(key, section) => console.log(key, section)}
/>
```

Edit keys, colours, positions and text in `src/consoleConfig.ts`. Pass `imageSrc` to use a different case image. A click or Enter on a focused key calls `onSelect`. Physical shortcuts only preview text on the screen.

## Device artwork

The case image at `public/assets/device-reference.png` is by Debbie (@ui.debbie on Instagram), shared publicly with her design brief. It is not covered by the MIT licence. If you are the artist and want it removed, please open an issue, and I will take it down. The key coordinates in `consoleConfig.ts` are measured for this image.

## Keyboard shortcuts

With the pointer over the console:

- P, R, T, F, L, I: the matching keys
- O: top-row O. Shift+O: first lower O. H: SAY HELLO
- Enter: LET'S TALK. Shift+8 (*): the star key

## Known limitations

- The key coordinates only fit the supplied artwork.
- The console size is set in `ConsoleStage.tsx`.
- Section dialogs were left out on purpose, to keep attention on the console. Use `onSelect` to react to clicks.

## Credits

Design brief and device artwork by Debbie (@ui.debbie on Instagram). Built with React and TypeScript, with AI assistance from Gemini and Claude.

## Licence

The code is MIT licensed (see `LICENSE`). The device artwork
