// ========== Game Variables ==========
let leaves = 0;
let leafValue = 1;
let spawnRate = 1; // leaves per second
let maxLeaves = 20;
let passiveRate = 0;

let spawnCost = 10;
let valueCost = 25;
let capCost = 50;
let passiveCost = 100;

const leafArea = document.getElementById("leaf-area");
const leafCountDisplay = document.getElementById("leafCount");
const leafValueDisplay = document.getElementById("leafValue");

// ========== Save & Load ==========
function saveGame() {
  const data = {
    leaves,
    leafValue,
    spawnRate,
    maxLeaves,
    passiveRate,
    spawnCost,
    valueCost,
    capCost,
    passiveCost
  };
  localStorage.setItem("leafClickerSave", JSON.stringify(data));
}

function loadGame() {
  const data = JSON.parse(localStorage.getItem("leafClickerSave"));
  if (data) Object.assign(window, data);
  updateUI();
}

window.addEventListener("beforeunload", saveGame);
window.addEventListener("load", loadGame);

// ========== UI ==========
function updateUI() {
  leafCountDisplay.textContent = Math.floor(leaves);
  leafValueDisplay.textContent = leafValue;
  document.getElementById("spawnCost").textContent = spawnCost;
  document.getElementById("valueCost").textContent = valueCost;
  document.getElementById("capCost").textContent = capCost;
  document.getElementById("passiveCost").textContent = passiveCost;
}

// ========== Leaf Spawning ==========
function spawnLeaf() {
  // Check if max leaves reached
  if (document.querySelectorAll(".leaf").length >= maxLeaves) return;

  const leaf = document.createElement("img");
  const leafType = Math.random();

  if (leafType < 0.8) leaf.src = "assets/leaf1.png";
  else if (leafType < 0.97) leaf.src = "assets/leaf2.png";
  else leaf.src = "assets/leaf3.png";

  leaf.className = "leaf";
  leaf.style.left = `${Math.random() * (leafArea.clientWidth - 64)}px`;
  leaf.style.top = `${Math.random() * (leafArea.clientHeight - 64)}px`;

  leaf.addEventListener("click", () => {
    leaves += leafValue;
    leaf.remove();
    updateUI();
  });

  leafArea.appendChild(leaf);
}

// ========== Smarter Spawn Loop ==========
let spawnAccumulator = 0;
setInterval(() => {
  spawnAccumulator += spawnRate / 10; // smaller interval for smoother spawn
  const currentLeaves = document.querySelectorAll(".leaf").length;
  const availableSpots = maxLeaves - currentLeaves;

  while (spawnAccumulator >= 1 && availableSpots > 0) {
    spawnLeaf();
    spawnAccumulator -= 1;
  }
}, 100); // runs 10 times per second

// ========== Passive Leaf Gain ==========
setInterval(() => {
  leaves += passiveRate;
  updateUI();
}, 1000);

// ========== Upgrades ==========
document.getElementById("upgradeSpawn").addEventListener("click", () => {
  if (leaves >= spawnCost) {
    leaves -= spawnCost;
    spawnRate += 1;
    spawnCost = Math.floor(spawnCost * 1.6);
    updateUI();
  }
});

document.getElementById("upgradeValue").addEventListener("click", () => {
  if (leaves >= valueCost) {
    leaves -= valueCost;
    leafValue += 1 * leafValue;
    valueCost = Math.floor(valueCost * 1.7);
    updateUI();
  }
});

document.getElementById("upgradeCap").addEventListener("click", () => {
  if (leaves >= capCost) {
    leaves -= capCost;
    maxLeaves += 10;
    capCost = Math.floor(capCost * 1.5);
    updateUI();
  }
});

document.getElementById("upgradePassive").addEventListener("click", () => {
  if (leaves >= passiveCost) {
    leaves -= passiveCost;
    passiveRate += 0.5;
    passiveCost = Math.floor(passiveCost * 2);
    updateUI();
  }
});

updateUI();

