import "./style.css";

// UI: Core click button for manual crystal gain
const clickBtn = document.createElement("button");
clickBtn.id = "clickMe";
clickBtn.textContent = "⛏️ Mine Crystal";
document.body.appendChild(clickBtn);

// State: Tracks player crystals and passive growth
let counter = 0;
const counterDiv = document.createElement("div");
counterDiv.id = "counter";
document.body.appendChild(counterDiv);

let growthRate = 0;

// UI: Displays the player's current crystal growth rate
const rateDiv = document.createElement("div");
rateDiv.id = "rate";
document.body.appendChild(rateDiv);

// UI: Shows owned items and inventory status
const inventoryDiv = document.createElement("div");
inventoryDiv.id = "inventory";
document.body.appendChild(inventoryDiv);

// UI: Contains all purchasable upgrade buttons
const shop = document.createElement("div");
shop.id = "shop";
document.body.appendChild(shop);

// Data Model: Defines structure for all upgrade items
interface Item {
  key: string;
  name: string;
  emoji: string;
  description: string;
  baseCost: number;
  cost: number;
  rate: number;
  count: number;
}

const PRICE_FACTOR = 1.15;

// Game Data: List of upgrades available to the player
const availableItems: Item[] = [
  {
    key: "cart",
    name: "Mine Cart",
    emoji: "🛒",
    description: "A wobbly cart that scoops loose crystals.",
    baseCost: 10,
    cost: 10,
    rate: 0.1,
    count: 0,
  },
  {
    key: "drone",
    name: "Survey Drone",
    emoji: "🛰️",
    description: "Autonomous scout that maps rich seams.",
    baseCost: 50,
    cost: 50,
    rate: 0.6,
    count: 0,
  },
  {
    key: "drill",
    name: "Drill Rig",
    emoji: "⛏️",
    description: "Industrial rig that bores through tough strata.",
    baseCost: 100,
    cost: 100,
    rate: 2.0,
    count: 0,
  },
  {
    key: "lab",
    name: "Geode Lab",
    emoji: "🧪",
    description: "Cracks geodes and refines shards efficiently.",
    baseCost: 500,
    cost: 500,
    rate: 8.0,
    count: 0,
  },
  {
    key: "reactor",
    name: "Crystal Reactor",
    emoji: "🔮",
    description: "Synthesizes flawless crystals at scale.",
    baseCost: 1000,
    cost: 1000,
    rate: 50,
    count: 0,
  },
];

// UI Setup: Generate upgrade buttons and interactions
const buttons = new Map<string, HTMLButtonElement>();

for (const it of availableItems) {
  const btn = document.createElement("button");
  btn.className = "upgradeBtn";
  btn.dataset.key = it.key;
  btn.title = it.description;
  btn.textContent = `${it.emoji} Buy ${it.name} (+${it.rate}/s) • Cost: ${
    it.cost.toFixed(2)
  } crystals`;
  btn.disabled = true;
  buttons.set(it.key, btn);
  shop.appendChild(btn);

  btn.addEventListener("click", () => {
    if (counter >= it.cost) {
      counter -= it.cost;
      it.count += 1;
      // Price scales exponentially after each purchase to increase challenge
      it.cost = it.baseCost * Math.pow(PRICE_FACTOR, it.count);
      recomputeGrowthRate();
      paint();
    }
  });
}

// Logic: Calculates growth rate and button state
function recomputeGrowthRate() {
  growthRate = availableItems.reduce((sum, it) => sum + it.count * it.rate, 0);
}

function updateAffordability() {
  for (const it of availableItems) {
    const btn = buttons.get(it.key)!;
    btn.disabled = counter < it.cost;
  }
}

// Rendering: Updates different parts of the UI
function paintCounter() {
  counterDiv.textContent = `${counter.toFixed(2)} Crystals 💎`;
}

function paintRate() {
  rateDiv.textContent = `Rate: ${growthRate.toFixed(2)} Crystals/sec`;
}

function paintInventory() {
  inventoryDiv.textContent = `Owned: ${
    availableItems.map((it) => `${it.name}×${it.count}`).join(" | ")
  }`;
}

function paintShop() {
  for (const it of availableItems) {
    const btn = buttons.get(it.key)!;
    btn.textContent = `${it.emoji} Buy ${it.name} (+${it.rate}/s) • Cost: ${
      it.cost.toFixed(2)
    } crystals`;
    btn.title = it.description;
  }
}

// Rendering: Updates all displays at once
function paint() {
  paintCounter();
  paintRate();
  paintInventory();
  paintShop();
  updateAffordability();
}

// Input Handling: Clicking manually increases crystals
clickBtn.addEventListener("click", () => {
  counter += 1;
  paint();
});

// Game Loop: Adds passive crystals over time
let lastTime = performance.now();

function update(now: number) {
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  if (growthRate > 0) {
    counter += growthRate * delta;
    paintCounter();
    paintRate();
    updateAffordability();
  }

  requestAnimationFrame(update);
}

// Startup: Initialize and start the loop
paint();
requestAnimationFrame(update);
