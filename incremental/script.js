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

// Leaf types with individual values
const leafTypes = [
  { src: "assets/leaf1.png", value: 1 },
  { src: "assets/leaf2.png", value: 3 },
  { src: "assets/leaf3.png", value: 10 },
];

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
  if (data) {
    leaves = data.leaves || 0;
    leafValue = data.leafValue || 1;
    spawnRate = data.spawnRate || 1;
    maxLeaves = data.maxLeaves || 20;
    passiveRate = data.passiveRate || 0;
    spawnCost = data.spawnCost || 10;
    valueCost = data.valueCost || 25;
    capCost = data.capCost || 50;
    passiveCost = data.passiveCost || 100;
  }
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
  if (document.querySelectorAll(".leaf").length >= maxLeaves) return;

  const leaf = document.createElement("img");
  // Pick leaf type
  const rand = Math.random();
  let type;
  if (rand < 0.8) type = leafTypes[0];
  else if (rand < 0.97) type = leafTypes[1];
  else type = leafTypes[2];

  leaf.src = type.src;
  leaf.dataset.value = type.value; // store leaf-specific value
  leaf.className = "leaf";
  leaf.style.left = `${Math.random() * (leafArea.clientWidth - 64)}px`;
  leaf.style.top = `${Math.random() * (leafArea.clientHeight - 64)}px`;

  leaf.addEventListener("click", () => {
    leaves += parseInt(leaf.dataset.value); // use leaf-specific value
    leaf.remove();
    updateUI();
  });

  leafArea.appendChild(leaf);
}

// ========== Smarter Spawn Loop ==========
let spawnAccumulator = 0;
setInterval(() => {
  spawnAccumulator += spawnRate / 10;
  const currentLeaves = document.querySelectorAll(".leaf").length;
  const availableSpots = maxLeaves - currentLeaves;

  while (spawnAccumulator >= 1 && availableSpots > 0) {
    spawnLeaf();
    spawnAccumulator -= 1;
  }
}, 100);

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
    leafValue += 1; // base increment
    // Also increase values of leafTypes (optional, so higher leafs scale)
    leafTypes.forEach((lt, i) => { lt.value += i + 1; });
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




