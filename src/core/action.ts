import { punchHeavy, punchMedium } from "../cards.js";
import { shuffle } from "../lib.js";
import { BattleMode, GameData, State, TitleMode } from "./state.js";

export type TitleAction = {
  start: (data: TitleMode) => void;
};

const createTitleAction = (state: State): TitleAction => {
  const start: TitleAction["start"] = (data: TitleMode) => {
    const { baseDeck, baseHp } = data;

    const dragonDraw = shuffle([
      punchMedium,
      punchMedium,
      punchHeavy,
      punchHeavy,
    ]);
    const dragonHand = dragonDraw.splice(0, 3);
    const [dragonPlay] = dragonHand.splice(0, 1);
    if (!dragonPlay) throw new Error("dragon play card is undefined");

    const battleMode: BattleMode = {
      baseDeck,
      baseHp,
      dragonDiscard: [],
      dragonDraw,
      dragonHand,
      dragonHp: 10,
      dragonPlay,
      dragonStun: 0,
      knightDiscard: [],
      knightDraw: shuffle(baseDeck),
      knightHand: [],
      knightHp: baseHp,
      knightPlay: null,
      knightStun: 0,
      mode: "battle",
      phase: "draw",
    };

    state.update(battleMode);
  };

  const action: TitleAction = {
    start,
  };

  return action;
};

export type BattleAction = {
  drawCard: (data: BattleMode) => void;
  playCard: (data: BattleMode, index: number) => void;
  resetGame: () => void;
};

const createBattleAction = (state: State): BattleAction => {
  const drawCard: BattleAction["drawCard"] = (data) => {
    const { knightDraw, knightHand } = data;

    const diff: Partial<GameData> = {
      mode: "battle",
    };

    const card = knightDraw.pop();
    if (!card) throw Error("draw card is undefined");
    diff.knightDraw = knightDraw;

    knightHand.push(card);
    diff.knightHand = knightHand;

    if (knightDraw.length < 1) diff.phase = "play";
    if (knightHand.length >= 3) diff.phase = "play";

    state.update(diff);
  };

  const playCard: BattleAction["playCard"] = (data, index) => {
    const { knightHand } = data;

    const [card] = knightHand.splice(index, 1);
    if (!card) throw new Error(`card at hand index ${index} is undefined`);

    const diff: Partial<GameData> = {
      knightHand,
      knightPlay: card,
      mode: "battle",
      phase: "fight",
    };

    state.update(diff);
  };

  const action: BattleAction = {
    drawCard,
    playCard,
    resetGame: state.reset,
  };

  return action;
};

export type Action = {
  battle: BattleAction;
  title: TitleAction;
};

export type GameMode = keyof Action;

export const createAction = (state: State) => {
  const battle = createBattleAction(state);
  const title = createTitleAction(state);

  const action: Action = {
    title,
    battle,
  };

  return action;
};
