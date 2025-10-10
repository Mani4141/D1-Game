import "./style.css";

const button = document.createElement("button");
button.id = "clickMe";
button.textContent = "💎 Click Me!";
document.body.appendChild(button);

button.addEventListener("click", () => {
  console.log("Button clicked!");
});
