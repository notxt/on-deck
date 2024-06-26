import { attackCard, blockCard, throwCard } from "./cards.js";

export type CardType = "block" | "attack" | "throw";

export type Card = {
  type: CardType;
};

export type Stats = {
  hit: number;
};

export type Fighter = {
  deck: Card[];
  stats: Stats;
};

type Position = "discard" | "draw" | "hand" | "play";
export type BattleCard = Card & {
  position: Position;
};
export type Slot = BattleCard | null;

export type BattleDeck = { [key in Position]: BattleCard[] };

type BattleFighter = {
  stats: Stats;
  deck: BattleDeck;
};

type BattlePhase = "draw" | "play" | "fight";
export type BattleState = {
  phase: BattlePhase;
  dragon: BattleFighter;
  knight: BattleFighter;
};

type GameMode = "title" | "battle";
export type State = {
  player: Fighter;
  mode: GameMode;
  battle: BattleState | null;
};

export const createState = (): State => {
  const game = loadGame();
  if (!game) return newGame();
  return game;
};

const loadGame = (): State | null => {
  const item = localStorage.getItem("state");
  if (item === null) return null;

  let state: State;
  try {
    state = JSON.parse(item);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) return null;
    throw error;
  }

  return state;
};

const newGame = (): State => {
  const startingDeck = [
    attackCard,
    attackCard,
    blockCard,
    blockCard,
    throwCard,
    throwCard,
  ];

  const player: Fighter = {
    deck: startingDeck,
    stats: {
      hit: 10,
    },
  };

  const state: State = {
    mode: "title",
    player,
    battle: null,
  };

  return state;
};
