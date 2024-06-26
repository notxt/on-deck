import { attackCard } from "./cards.js";
import { shuffle } from "./lib.js";
import {
  BattleCard,
  BattleDeck,
  BattleState,
  Card,
  Fighter,
  State,
} from "./state.js";

export type TitleAction = {
  startGame: () => void;
};

export type BattleAction = {
  drawCard: () => void;
  playCard: (card: BattleCard) => void;
};

export type Action = {
  title: TitleAction;
  battle: BattleAction;
};

type Update = (state: State) => void;
type AddUpdateListener = (update: Update) => void;

type Result = {
  action: Action;
  update: AddUpdateListener;
};

const createBattleDeck = (cards: BattleCard[]): BattleDeck => {
  const deck: BattleDeck = {
    discard: cards.filter((card) => card.position === "discard"),
    draw: cards.filter((card) => card.position === "draw"),
    hand: cards.filter((card) => card.position === "hand"),
    play: cards.filter((card) => card.position === "play"),
  };

  return deck;
};

export const createAction = (state: State) => {
  const listeners: Update[] = [];
  const addUpdateListener: AddUpdateListener = (update: Update) =>
    listeners.push(update);

  const update: Update = (state) => {
    localStorage.setItem("state", JSON.stringify(state));
    listeners.forEach((listener) => listener(state));
  };

  const startGame: TitleAction["startGame"] = () => {
    const dragon: Fighter = {
      deck: [attackCard, attackCard, attackCard],
      stats: {
        hit: 10,
      },
    };

    const dragonDeck = createBattleDeck(shuffle(dragon.deck).map(createCard));

    const topCard = dragonDeck.draw.pop();
    if (typeof topCard === "undefined")
      throw new Error("top card in dragon deck is undefined");

    dragonDeck.play.push(topCard);

    const battle: BattleState = {
      phase: "draw",
      dragon: {
        stats: dragon.stats,
        deck: dragonDeck,
      },
      knight: {
        stats: state.player.stats,
        deck: createBattleDeck(shuffle(state.player.deck).map(createCard)),
      },
    };

    state.mode = "battle";
    state.battle = battle;

    console.log(state);

    update(state);
  };

  const title: TitleAction = {
    startGame,
  };

  const drawCard: BattleAction["drawCard"] = () => {
    if (state.battle === null)
      throw new Error("cannot draw card when state.battle is null");

    const deck = state.battle.knight.deck;

    const card = deck.draw.pop();
    if (typeof card === "undefined")
      throw new Error("cannot draw card when draw pile is empty");

    deck.hand.push(card);

    if (deck.draw.length < 1) state.battle.phase = "play";
    if (deck.hand.length >= 3) state.battle.phase = "play";

    update(state);
  };

  const playCard: BattleAction["playCard"] = (cardToPlay: BattleCard) => {
    if (state.battle === null)
      throw new Error("cannot play card when state.battle is null");

    const index = state.battle.knight.deck.hand.findIndex(
      (card) => card === cardToPlay
    );
    if (index === -1)
      throw new Error(
        `unable to find card ${cardToPlay} in hand ${state.battle.knight.deck.hand}`
      );

    state.battle.knight.deck.hand.splice(index, 1);
    state.battle.knight.deck.play.push(cardToPlay);

    update(state);
  };

  const battle: BattleAction = {
    drawCard,
    playCard,
  };

  const result: Result = {
    action: {
      battle,
      title,
    },
    update: addUpdateListener,
  };

  return result;
};

const createCard = (card: Card): BattleCard => {
  const { type } = card;

  const result: BattleCard = {
    position: "draw",
    type,
  };

  return result;
};
