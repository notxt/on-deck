import { GameData, State } from "./state.js";

const controlKeys = ["Shift", "Control", "Alt", "Meta"] as const;
type ControlKey = (typeof controlKeys)[number];
const isControlKey = (key: string): key is ControlKey =>
  controlKeys.includes(key as ControlKey);

export const gameKeys = ["0", "1", "2", "r", "Enter"] as const;
export type GameKey = (typeof gameKeys)[number];
const isGameKey = (key: string): key is GameKey =>
  gameKeys.includes(key as GameKey);

export type KeyPressed = (key: GameKey, data: GameData) => void;
export type WatchKeyPressed = (watch: KeyPressed) => void;

export const watchKeyPressedFactory = (state: State): WatchKeyPressed => {
  const watchers: KeyPressed[] = [];

  let controlKeyDown = false;

  const keydown = (event: KeyboardEvent) => {
    const { key } = event;
    console.log(key);

    if (isControlKey(key)) {
      controlKeyDown = true;
      return;
    }

    if (controlKeyDown) return;

    if (!isGameKey(key)) return;

    watchers.forEach((listener) => listener(key, state.get()));
  };

  const keyup = (event: KeyboardEvent) => {
    const { key } = event;

    if (isControlKey(key)) {
      controlKeyDown = false;
      return;
    }
  };

  document.onkeydown = keydown;
  document.onkeyup = keyup;

  const result: WatchKeyPressed = (listener) => watchers.push(listener);

  return result;
};
