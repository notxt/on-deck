import { Card } from "./cards.js";
import { Opponent, Player } from "./main.js";
import { createHand } from "./view/hand.js";

const { random, floor } = Math;

type State = {
  player: {
    hp: number;
  };
  opponent: {
    hp: number;
  };
  discard: Card[];
  draw: Card[];
  hand: Card[];
  play: Card[];
};

const renderDraw = (state: State): HTMLElement => {
  const count = document.createElement("p");
  count.textContent = state.draw.length.toString();

  const draw = document.createElement("div");
  draw.appendChild(count);

  return draw;
};

const renderDiscard = (state: State): HTMLElement => {
  const count = document.createElement("p");
  count.textContent = state.discard.length.toString();

  const discard = document.createElement("div");
  discard.appendChild(count);

  return discard;
};

const render = (state: State): HTMLElement => {
  if (state.player.hp < 1) return lose();
  if (state.opponent.hp < 1) return win();

  const battleContent = document.createElement("div");
  battleContent.textContent = `HP: ???`;

  const draw = renderDraw(state);
  const hand = createHand(state.hand);
  const discard = renderDiscard(state);

  const cardContent = document.createElement("div");
  cardContent.append(draw, hand, discard);

  const content = document.createElement("div");
  content.append(battleContent, cardContent);

  return content;
};

type Update = (state: State) => void;
const updateFactory =
  (view: HTMLElement): Update =>
  (state) => {
    const content = render(state);
    view.replaceChildren(content);
  };

const win = (): HTMLElement => {
  const win = document.createElement("p");
  win.textContent = "You win!";

  return win;
};

const lose = (): HTMLElement => {
  const lose = document.createElement("p");
  lose.textContent = "You lose";

  return lose;
};

const shuffle = (cards: Card[]): Card[] => {
  const shuffled: Card[] = [];

  let deck = cards;
  while (deck.length > 0) {
    const i = floor(random() * deck.length);

    const card = deck[i];
    if (typeof card === "undefined")
      throw new Error(`No card at index ${i} in deck ${deck}`);
    shuffled.push(card);

    deck.splice(i, 1);
  }

  console.log(cards, shuffled);

  return shuffled;
};

const handSize = 3;
const drawFactory = (update: Update) => (state: State) => {
  let { hand, draw, discard } = state;

  if (hand.length >= handSize) return update(state);

  while (hand.length < handSize) {
    if (draw.length < 1) {
      draw = state.discard;
      discard = [];
    }
    const [card, ...rest] = draw;
    if (typeof card === "undefined")
      throw new Error(`Card is undefined
draw: ${draw}
hand: ${hand}
discard: ${discard}
      `);

    hand = [card, ...hand];
    draw = rest;
  }

  state.draw = draw;
  state.hand = hand;
  state.discard = discard;

  return update(state);
};

export const startBattleFactory =
  (view: HTMLElement) => (config: { player: Player; opponent: Opponent }) => {
    const { player, opponent } = config;

    const state: State = {
      player,
      opponent,
      discard: [],
      draw: shuffle(player.deck),
      hand: [],
      play: [],
    };

    const update = updateFactory(view);
    const draw = drawFactory(update);
    draw(state);
  };
