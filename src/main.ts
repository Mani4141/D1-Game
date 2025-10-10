import "./style.css";

//button
const button = document.createElement("button");
button.id = "clickMe";
button.textContent = "💎 Click Me!";
document.body.appendChild(button);

//counter
let counter: number = 0;
const counterDiv = document.createElement("div");
counterDiv.id = "counter";
document.body.appendChild(counterDiv);

let growthRate = 0;

// Upgrade button
const UPGRADE_COST = 10;
const upgradeBtn = document.createElement("button");
upgradeBtn.id = "upgradeBtn";
upgradeBtn.textContent = `🚀 Buy Upgrade (+1/s) [Cost: ${UPGRADE_COST} 💎]`;
upgradeBtn.disabled = true; // disabled until player has >= 10
document.body.appendChild(upgradeBtn);

// Optional: show current growth rate
const rateDiv = document.createElement("div");
rateDiv.id = "rate";
document.body.appendChild(rateDiv);

// Helpers
function updateCounterText() {
  counterDiv.textContent = `${counter.toFixed(2)} 💎`;
}

function updateRateText() {
  rateDiv.textContent = `Rate: ${growthRate.toFixed(2)} /s`;
}

function updateAffordability() {
  upgradeBtn.disabled = counter < UPGRADE_COST;
}

//counter logic
button.addEventListener("click", () => {
  counter++;
  updateCounterText();
  updateAffordability();
  console.log(`💎 You now have ${counter} diamonds!`);
});

// Purchase upgrade when affordable
upgradeBtn.addEventListener("click", () => {
  if (counter >= UPGRADE_COST) {
    counter -= UPGRADE_COST;
    growthRate += 1; // +1 per second
    updateCounterText();
    updateRateText();
    updateAffordability();
    console.log(`🚀 Purchased upgrade. New rate: ${growthRate.toFixed(2)}/s`);
  }
});

let lastTime = performance.now();

function update(now: number) {
  // Time since last frame (in seconds)
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  if (growthRate > 0) {
    counter += growthRate * delta;
    updateCounterText();
    updateAffordability();
  }
  requestAnimationFrame(update);
}

// Start animation loop
updateCounterText();
updateRateText();
updateAffordability();
requestAnimationFrame(update);
