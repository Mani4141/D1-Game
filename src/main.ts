import "./style.css";

//click
const clickBtn = document.createElement("button");
clickBtn.id = "clickMe";
clickBtn.textContent = "⛏️ Mine Crystal";
document.body.appendChild(clickBtn);

//counter
let counter = 0;
const counterDiv = document.createElement("div");
counterDiv.id = "counter";
document.body.appendChild(counterDiv);

let growthRate = 0;

// rate display
const rateDiv = document.createElement("div");
rateDiv.id = "rate";
document.body.appendChild(rateDiv);

const inventoryDiv = document.createElement("div");
inventoryDiv.id = "inventory";
document.body.appendChild(inventoryDiv);

//shop
const shop = document.createElement("div");
shop.id = "shop";
document.body.appendChild(shop);

// --- Data-driven items (no hard-coded logic elsewhere) ---
interface Item {
  key: string; // stable id
  name: string; // label shown to user
  emoji: string;
  baseCost: number; // starting cost
  cost: number; // current cost (scales by factor)
  rate: number; // crystals per second
  count: number; // owned
}

const PRICE_FACTOR = 1.15;

const availableItems: Item[] = [
  {
    key: "cart",
    name: "Mine Cart",
    emoji: "🛒",
    baseCost: 10,
    cost: 10,
    rate: 0.1,
    count: 0,
  },
  {
    key: "drill",
    name: "Drill Rig",
    emoji: "⛏️",
    baseCost: 100,
    cost: 100,
    rate: 2.0,
    count: 0,
  },
  {
    key: "reactor",
    name: "Crystal Reactor",
    emoji: "🔮",
    baseCost: 1000,
    cost: 1000,
    rate: 50,
    count: 0,
  },
];

const buttons = new Map<string, HTMLButtonElement>();

// buttons for upgrades (loop builds all)
for (const it of availableItems) {
  const btn = document.createElement("button");
  btn.className = "upgradeBtn";
  btn.dataset.key = it.key;
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
      // 15% exponential price increase after each purchase
      it.cost = it.baseCost * Math.pow(PRICE_FACTOR, it.count);
      recomputeGrowthRate();
      paint();
      console.log(
        `⚙️ Purchased ${it.name} (x${it.count}). Next cost: ${
          it.cost.toFixed(2)
        } crystals • Total rate: ${growthRate.toFixed(2)}/s`,
      );
    }
  });
}

//helpers (all loop-based over availableItems)
function recomputeGrowthRate() {
  growthRate = availableItems.reduce((sum, it) => sum + it.count * it.rate, 0);
}

function updateAffordability() {
  for (const it of availableItems) {
    const btn = buttons.get(it.key)!;
    btn.disabled = counter < it.cost;
  }
}

function paintCounter() {
  counterDiv.textContent = `${counter.toFixed(2)} crystals ⛏️`;
}

function paintRate() {
  rateDiv.textContent = `Rate: ${growthRate.toFixed(2)} crystals/sec`;
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
  }
}

function paint() {
  paintCounter();
  paintRate();
  paintInventory();
  paintShop();
  updateAffordability();
}

// Click logic
clickBtn.addEventListener("click", () => {
  counter += 1;
  paint();
  console.log(`💎 +1 crystal! Total: ${counter.toFixed(2)}`);
});

//passive income logic
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

// --- Initialize UI ---
paint();
requestAnimationFrame(update);
