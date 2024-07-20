import { Action, BattleAction, TitleAction } from "./action.js";
import { BattleMode, State, TitleMode } from "./state.js";

const controlKeys = ["Shift", "Control", "Alt", "Meta"] as const;
type ControlKey = (typeof controlKeys)[number];
const isControlKey = (key: string): key is ControlKey =>
  controlKeys.includes(key as ControlKey);

export const gameKeys = ["0", "1", "2", "r", "Enter"] as const;
export type GameKey = (typeof gameKeys)[number];
const isGameKey = (key: string): key is GameKey =>
  gameKeys.includes(key as GameKey);

export const listenForKeyPress = (state: State, action: Action): void => {
  const handleKey = handleKeyFactory(state, action);

  let controlKeyDown = false;

  const keydown = (event: KeyboardEvent) => {
    const { key } = event;

    if (controlKeyDown) return;

    if (isControlKey(key)) {
      controlKeyDown = true;
      return;
    }

    if (!isGameKey(key)) return;

    handleKey(key);
  };

  const keyup = (event: KeyboardEvent) => {
    const { key } = event;

    if (!isControlKey(key)) return;

    controlKeyDown = false;
  };

  document.onkeydown = keydown;
  document.onkeyup = keyup;
};

const handleKeyFactory = (state: State, action: Action) => {
  const handleBattleKey = handleBattleKeyFactory(action.battle);
  const handleTitleKey = handleTitleKeyFactory(action.title);

  return (key: GameKey) => {
    const data = state.get();

    if (data.mode === "battle") {
      handleBattleKey(data, key);
      return;
    }

    if (data.mode === "title") {
      handleTitleKey(data, key);
      return;
    }
  };
};

const handleBattleKeyFactory =
  (action: BattleAction) => (data: BattleMode, key: GameKey) => {
    console.log(data);
    const hand = data.knightDeck.filter((card) => card.position === "hand");
    const draw = data.knightDeck.filter((card) => card.position === "draw");

    if (key === "Enter") {
      if (hand.length >= 3) return;
      if (draw.length < 1) return;

      action.drawCard(data);

      return;
    }

    if (key === "0" || key === "1" || key === "2") {
      const index = parseInt(key, 10);

      action.playCard(data, index);

      return;
    }

    if (key === "r") {
      action.resetGame();

      return;
    }
  };

const handleTitleKeyFactory =
  (action: TitleAction) => (data: TitleMode, key: GameKey) => {
    if (key === "Enter") {
      action.start(data);
      return;
    }
  };
