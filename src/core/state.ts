import { punchHeavy, punchLight, punchMedium } from "../cards.js";

export type Punch = {
  damage: number;
  name: string;
  recoveryBlock: number;
  recoveryHit: number;
  startup: number;
  stunBlock: number;
  stunHit: number;
  type: "punch";
};

export type Card = Punch;
export type CardType = Card["type"];

export type BattlePhase = "draw" | "play" | "fight";

type Base = {
  baseDeck: Card[];
  baseHp: number;
};

export type TitleMode = Base & {
  mode: "title";
};

export type BattleMode = Base & {
  dragonDiscard: Card[];
  dragonDraw: Card[];
  dragonHand: Card[];
  dragonHp: number;
  dragonPlay: Card | null;
  dragonStun: number;
  knightDiscard: Card[];
  knightDraw: Card[];
  knightHand: Card[];
  knightHp: number;
  knightPlay: Card | null;
  knightStun: number;
  mode: "battle";
  phase: BattlePhase;
};

export type GameData = TitleMode | BattleMode;

export type Update = (diff: Partial<GameData>) => void;
export type Updated = (data: GameData) => void;
export type WatchUpdated = (watch: Updated) => void;

export type State = {
  get: () => GameData;
  reset: () => void;
  update: Update;
  watchUpdated: WatchUpdated;
};

const key = "state";

export const createState = (): State => {
  const data = getData();

  const get: State["get"] = () => data;

  const watchers: Updated[] = [];
  const watchUpdated: State["watchUpdated"] = (watch) => watchers.push(watch);

  const update: State["update"] = (diff) => {
    Object.assign(data, diff);
    localStorage.setItem(key, JSON.stringify(data));
    watchers.forEach((watch) => watch(data));
  };

  const reset: State["reset"] = () => {
    localStorage.removeItem(key);
    update(newGame());
  };

  const state: State = {
    get,
    reset,
    update,
    watchUpdated,
  };

  return state;
};

const getData = (): GameData => {
  const data = loadData();
  return data !== null ? data : newGame();
};

const loadData = (): GameData | null => {
  const item = localStorage.getItem("state");
  if (item === null) return null;

  let state: GameData;
  try {
    state = JSON.parse(item);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return null;
    throw error;
  }

  return state;
};

const newGame = (): GameData => {
  const baseDeck: Card[] = [
    punchLight,
    punchLight,
    punchMedium,
    punchMedium,
    punchHeavy,
    punchHeavy,
  ];

  const state: GameData = {
    mode: "title",
    baseDeck: baseDeck,
    baseHp: 10,
  };

  return state;
};
