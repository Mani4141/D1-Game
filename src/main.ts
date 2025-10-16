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

//upgrades
type Upgrade = {
  key: string;
  label: string;
  cost: number;
  baseCost: number;
  rate: number;
  count: number;
  emoji: string;
};

const upgrades: Upgrade[] = [
  {
    key: "cart",
    label: "Mine Cart",
    cost: 10,
    baseCost: 10,
    rate: 0.1,
    count: 0,
    emoji: "🛒",
  },
  {
    key: "drill",
    label: "Drill Rig",
    cost: 100,
    baseCost: 100,
    rate: 2.0,
    count: 0,
    emoji: "⛏️",
  },
  {
    key: "reactor",
    label: "Crystal Reactor",
    cost: 1000,
    baseCost: 1000,
    rate: 50,
    count: 0,
    emoji: "🔮",
  },
];

const buttons = new Map<string, HTMLButtonElement>();

// buttons for upgrades
for (const u of upgrades) {
  const btn = document.createElement("button");
  btn.className = "upgradeBtn";
  btn.dataset.key = u.key;
  btn.textContent = `${u.emoji} Buy ${u.label} (+${u.rate}/s) • Cost: ${
    u.cost.toFixed(2)
  } crystals`;
  btn.disabled = true;
  buttons.set(u.key, btn);
  shop.appendChild(btn);

  btn.addEventListener("click", () => {
    if (counter >= u.cost) {
      counter -= u.cost;
      u.count += 1;

      // price increases by 15% per purchase
      u.cost = u.baseCost * Math.pow(1.15, u.count);

      recomputeGrowthRate();
      paint();
      console.log(
        `⚙️ Purchased ${u.label} (x${u.count}). Next cost: ${
          u.cost.toFixed(
            2,
          )
        } crystals • Total rate: ${growthRate.toFixed(2)} crystals/sec`,
      );
    }
  });
}

//helpers
function recomputeGrowthRate() {
  growthRate = upgrades.reduce((sum, u) => sum + u.count * u.rate, 0);
}

function updateAffordability() {
  for (const u of upgrades) {
    const btn = buttons.get(u.key)!;
    btn.disabled = counter < u.cost;
  }
}

function paintCounter() {
  counterDiv.textContent = `${counter.toFixed(2)} Crystals 💎`;
}

function paintRate() {
  rateDiv.textContent = `Rate: ${growthRate.toFixed(2)} Crystals/sec`;
}

function paintInventory() {
  const parts = upgrades.map((u) => `${u.label}×${u.count}`);
  inventoryDiv.textContent = `Owned: ${parts.join(" | ")}`;
}

function paintShop() {
  for (const u of upgrades) {
    const btn = buttons.get(u.key)!;
    btn.textContent = `${u.emoji} Buy ${u.label} (+${u.rate}/s) • Cost: ${
      u.cost.toFixed(2)
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
