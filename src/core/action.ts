import { punchHeavy, punchMedium } from "../cards.js";
import { shuffle } from "../lib.js";
import {
  BattleMode,
  Card,
  CardData,
  Fighter,
  Frame,
  State,
  TitleMode,
} from "./state.js";

const { random, floor } = Math;

export type TitleAction = {
  start: (data: TitleMode) => void;
};

const createTitleAction = (state: State): TitleAction => {
  const start: TitleAction["start"] = (data: TitleMode) => {
    const { baseDeck, baseHp } = data;

    const currentFrame = 0;

    const dragonCollection: CardData[] = [
      punchMedium,
      punchMedium,
      punchHeavy,
      punchHeavy,
    ];

    const dragon: Fighter = {
      moveStart: null,
      deck: shuffle(dragonCollection).map(initCard),
      hp: 10,
    };
    draw(dragon);
    draw(dragon);
    draw(dragon);
    play(dragon, 0, currentFrame);

    const knight: Fighter = {
      moveStart: null,
      deck: shuffle(baseDeck).map(initCard),
      hp: baseHp,
    };

    const battleMode: BattleMode = {
      baseDeck,
      baseHp,
      currentFrame,
      dragon,
      frames: [],
      knight,
      mode: "battle",
    };

    state.update(battleMode);
  };

  const action: TitleAction = {
    start,
  };

  return action;
};

const draw = (fighter: Fighter): void => {
  const pile = fighter.deck.filter((card) => card.position === "draw");
  if (pile.length < 1) throw new Error("draw pile is empty");

  const index = floor(random() * pile.length);
  const card = pile[index];
  if (typeof card === "undefined")
    throw new Error("card at index is undefined");

  card.position = "hand";
};

const play = (
  fighter: Fighter,
  handIndex: number,
  currentFrame: number
): void => {
  const hand = fighter.deck.filter((card) => card.position === "hand");
  if (hand.length < 1) throw new Error("hand is empty");

  const card = hand[handIndex];
  if (typeof card === "undefined")
    throw new Error(`no card at hand index ${handIndex}`);

  fighter.moveStart = currentFrame;
  card.position = "play";
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
  runFrame: (data: BattleMode) => void;
};

const createBattleAction = (state: State): BattleAction => {
  const drawCard: BattleAction["drawCard"] = (data) => {
    const { knight } = data;

    const hand = knight.deck.filter((card) => card.position === "hand");
    if (hand.length >= 3) throw new Error("hand is full");

    const draw = knight.deck.filter((card) => card.position === "draw");
    if (draw.length < 1) throw new Error("no card to draw");

    const card = draw[0];
    if (typeof card === "undefined") throw new Error("card is undefined");
    card.position = "hand";

    state.update(data);
  };

  const playCard: BattleAction["playCard"] = (data, index) => {
    const { knight, currentFrame } = data;

    play(knight, index, currentFrame);

    state.update(data);
  };

  const isStunned = (fighter: Fighter): boolean => {
    if (fighter.stun >= 1) {
      fighter.stun--
      return true;
    }
    return false;
  }

  const runFrame: BattleAction["runFrame"] = (data) => {
    const { knight, dragon, frames, currentFrame } = data;

    const knightCard = knight.deck.find((card) => card.position === "play");
    const dragonCard = dragon.deck.find((card) => card.position === "play");

    if (typeof knightCard === "undefined" || typeof dragonCard === "undefined")
      return;

    const previousFrame = frames[currentFrame - 1];
    if (typeof previousFrame === "undefined") {
      const frame: Frame = {
        dragon: 0,
        knight: 0,
      };

      frames[currentFrame] = frame;
      data.currentFrame++;

      return;
    }

    const frame: Frame = {
      dragon: previousFrame.dragon + 1,
      knight: previousFrame.knight + 1,
    };

    const knightStunned = isStunned(knight)
    const dragonStunned = isStunned(dragon)

    

    if (dragon.stun > 0) {
      dragon.stun--;
      return;
    }

    const knightHit = frame.knight knightCard.startup + knight.stun

    if (frame.knight >= knightCard.startup + knight.stun) {
      dragon.hp -= knightCard.damage;
      dragon.knightCard;
    }
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
