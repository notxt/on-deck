import { startBattleFactory } from "./battle.js";
import { Card, brute, knight, wizard } from "./cards.js";

const body = document.querySelector("body");
if (body === null) throw new Error("body is null");

const container = document.createElement("div");
container.classList.add("container");

body.append(container);

export type Player = {
  deck: Card[];
  hp: number;
};

const player: Player = {
  deck: [knight, knight, knight, knight, wizard, wizard, brute, brute, brute],
  hp: 50,
};

export type Opponent = {
  hp: number;
};

const opponent: Opponent = {
  hp: 10,
};

const startBattle = startBattleFactory(container);
startBattle({ player, opponent });
