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
counterDiv.textContent = `${counter} 💎`; // fun unit label 💎
document.body.appendChild(counterDiv);

//counter logic
button.addEventListener("click", () => {
  counter++;
  counterDiv.textContent = `${counter} 💎`;
  console.log(`💎 You now have ${counter} diamonds!`);
});

let lastTime = performance.now();

function update(now: number) {
  // Time since last frame (in seconds)
  const delta = (now - lastTime) / 1000;
  lastTime = now;

  // Increase counter by 1 per second of real time
  counter += delta;
  counterDiv.textContent = `${counter.toFixed(2)} diamonds 💎`;

  requestAnimationFrame(update);
}

// Start animation loop
requestAnimationFrame(update);
