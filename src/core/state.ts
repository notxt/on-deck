import { punchHeavy, punchLight, punchMedium } from "../cards.js";

export type Punch = {
  damage: number;
  name: string;
  recovery: number;
  recoveryBlock: number;
  startup: number;
  stun: number;
  stunBlock: number;
  type: "punch";
};

export type CardData = Punch;
export type CardType = CardData["type"];

export type CardPosition = "draw" | "hand" | "discard" | "play";
export type Card = CardData & {
  position: CardPosition;
};

type Base = {
  baseDeck: CardData[];
  baseHp: number;
};

export type TitleMode = Base & {
  mode: "title";
};

export type Frame = {
  dragon: number;
  knight: number;
};

export type Fighter = {
  deck: Card[];
  hp: number;
  moveStart: number | null;
  stun: number;
};

export type BattleMode = Base & {
  currentFrame: number;
  dragon: Fighter;
  knight: Fighter;
  frames: Frame[];
  mode: "battle";
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
    window.location.reload();
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
  const baseDeck: CardData[] = [
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
