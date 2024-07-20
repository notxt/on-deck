import { punchHeavy, punchMedium } from "../cards.js";
import { shuffle } from "../lib.js";
import { BattleMode, Card, CardData, State, TitleMode } from "./state.js";

const { random, floor } = Math;

export type TitleAction = {
  start: (data: TitleMode) => void;
};

const createTitleAction = (state: State): TitleAction => {
  const start: TitleAction["start"] = (data: TitleMode) => {
    const { baseDeck, baseHp } = data;

    const dragonCollection: CardData[] = [
      punchMedium,
      punchMedium,
      punchHeavy,
      punchHeavy,
    ];

    const dragonDeck = shuffle(dragonCollection).map(initCard);
    draw(dragonDeck);
    draw(dragonDeck);
    draw(dragonDeck);
    play(dragonDeck, 0);

    const battleMode: BattleMode = {
      baseDeck,
      baseHp,
      dragonDeck,
      dragonHp: 10,
      dragonStun: 0,
      frameIndex: 0,
      frames: [{ dragon: null, knight: null }],
      knightDeck: shuffle(baseDeck).map(initCard),
      knightHp: baseHp,
      knightStun: 0,
      mode: "battle",
    };

    state.update(battleMode);
  };

  const action: TitleAction = {
    start,
  };

  return action;
};

const draw = (deck: Card[]): void => {
  const pile = deck.filter((card) => card.position === "draw");
  if (pile.length < 1) throw new Error("draw pile is empty");

  const index = floor(random() * pile.length);
  const card = pile[index];
  if (typeof card === "undefined")
    throw new Error("card at index is undefined");

  card.position = "hand";
};

const play = (deck: Card[], index: number): void => {
  const hand = deck.filter((card) => card.position === "hand");
  if (hand.length < 1) throw new Error("hand is empty");

  const card = hand[index];
  if (typeof card === "undefined")
    throw new Error(`no card at hand index ${index}`);

  card.position = "discard";
};

const initCard = (data: CardData): Card => {
  const {
    damage,
    name,
    recovery,
    recoveryBlock,
    startup,
    stun,
    stunBlock,
    type,
  } = data;

  const card: Card = {
    damage,
    name,
    recovery,
    recoveryBlock,
    startup,
    stun,
    stunBlock,
    type,
    position: "draw",
  };

  return card;
};

export type BattleAction = {
  drawCard: (data: BattleMode) => void;
  playCard: (data: BattleMode, index: number) => void;
  resetGame: () => void;
};

const createBattleAction = (state: State): BattleAction => {
  const drawCard: BattleAction["drawCard"] = (data) => {
    const hand = data.knightDeck.filter((card) => card.position === "hand");
    if (hand.length >= 3) throw new Error("hand is full");

    const draw = data.knightDeck.filter((card) => card.position === "draw");
    if (draw.length < 1) throw new Error("no card to draw");

    const card = draw[0];
    if (typeof card === "undefined") throw new Error("card is undefined");
    card.position = "hand";

    state.update(data);
  };

  const playCard: BattleAction["playCard"] = (data, index) => {
    const hand = data.knightDeck.filter((card) => card.position === "hand");

    const card = hand[index];
    if (typeof card === "undefined")
      throw new Error(`no card at hand index ${index}`);

    card.position = "discard";

    state.update(data);
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
