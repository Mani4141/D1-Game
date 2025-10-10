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
