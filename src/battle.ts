import { Stats } from "./cards.js";
import { Opponent, Player } from "./main.js";
import { Hand } from "./view/hand.js";
import { Play } from "./view/play.js";
import { View } from "./view/view.js";

const { random, floor } = Math;

type Position = "discard" | "draw" | "hand" | "play";
export type Card = Stats & {
  id: string;
  position: Position;
};
export type Slot = Card | null;

export type State = {
  player: {
    deck: Card[];
    hp: number;
  };
  opponent: {
    deck: Card[];
    hp: number;
  };
};

export type Deck = { [key in Position]: Card[] };

const shuffle = (cards: Stats[]): Stats[] => {
  const shuffled: Stats[] = [];

  let deck = cards;
  while (deck.length > 0) {
    const i = floor(random() * deck.length);

    const card = deck[i];
    if (typeof card === "undefined")
      throw new Error(`No card at index ${i} in deck ${deck}`);
    shuffled.push(card);

    deck.splice(i, 1);
  }

  return shuffled;
};

const createCard = (stats: Stats): Card => {
  const { hp, art, at, type } = stats;

  const card: Card = {
    hp,
    art,
    at,
    id: crypto.randomUUID(),
    position: "draw",
    type,
  };

  return card;
};

export const startBattleFactory =
  (container: HTMLElement) =>
  (config: { player: Player; opponent: Opponent }) => {
    const { player, opponent } = config;

    const state: State = {
      player: {
        hp: player.hp,
        deck: shuffle(player.deck).map(createCard),
      },
      opponent: {
        hp: opponent.hp,
        deck: [],
      },
    };

    const view = new View({
      play: new Play(),
      hand: new Hand(),
    });
    container.appendChild(view);

    view.update(state);
  };
