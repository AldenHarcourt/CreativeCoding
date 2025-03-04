let bgImage;
let foodCount = 0;
let gameOver = false;
let hasSatDown = true;
let foodFightActive = false;
let foodFightClicks = 0;
let foodFightStartTime;
let opponentDefeated = false;
let readyToLeave = false;

let foodZones = [
  { x: 50, y: 220, w: 150, h: 100 }, // Leftmost food counter section
  { x: 200, y: 180, w: 150, h: 100 }, // Slightly higher
  { x: 350, y: 140, w: 150, h: 100 }, // Higher still
];

let sitZone = { x: 275, y: 300, w: 150, h: 100 }; // Sitting area
let exitZone = { x: 1150, y: 90, w: 150, h: 100 }; // Exit button in top right corner
let foodFightZone = { x: 500, y: 250, w: 100, h: 50 }; // Food fight button

function preload() {
  bgImage = loadImage('diningHall.png'); // Ensure the file is uploaded in OpenProcessing
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(bgImage);
  
  if (gameOver) {
    displayEndScreen();
    return;
  }
  
  displayInstructions();
  displayFoodZones();
  displaySitZone();
  displayExitZone();
  displayScore();
  if (foodFightActive) {
    displayFoodFightZone();
    checkFoodFightTimeout();
  }
}

function displayInstructions() {
  fill(255);
  textSize(20);
  textAlign(LEFT);
  text('Click on the food stations to get food! But you must sit down after each time.', 20, 30);
}

function displayFoodZones() {
  for (let zone of foodZones) {
    if (mouseIsOver(zone)) {
      fill(200, 100, 50, 150);
    } else {
      fill(255, 0, 0, 150);
    }
    rect(zone.x, zone.y, zone.w, zone.h);
  }
}

function displaySitZone() {
  fill(mouseIsOver(sitZone) ? color(50, 100, 200, 150) : color(0, 0, 255, 150));
  rect(sitZone.x, sitZone.y, sitZone.w, sitZone.h);
}

function displayExitZone() {
  fill(255, 255, 0, 150);
  rect(exitZone.x, exitZone.y, exitZone.w, exitZone.h);
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Exit", exitZone.x + exitZone.w / 2, exitZone.y + exitZone.h / 2);
}

function displayFoodFightZone() {
  fill(255, 0, 0, 150);
  rect(foodFightZone.x, foodFightZone.y, foodFightZone.w, foodFightZone.h);
  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Food Fight!", foodFightZone.x + foodFightZone.w / 2, foodFightZone.y + foodFightZone.h / 2);
}

function displayScore() {
  fill(255);
  textSize(24);
  textAlign(RIGHT);
  text(`Food Collected: ${foodCount}/5`, width - 20, 30);
}

function mousePressed() {
  if (gameOver) return;

  for (let zone of foodZones) {
    if (mouseIsOver(zone)) {
      if (hasSatDown) {
        foodCount++;
        hasSatDown = false;
        if (foodCount >= 5 && !opponentDefeated) {
          alert("Only one other person remains in the dining hall! Engage in a food fight to make them leave.");
          foodFightActive = true;
          foodFightClicks = 0;
          foodFightStartTime = millis();
        }
      } else {
        alert("You need to sit down and eat before getting more food!");
      }
      return;
    }
  }
  
  if (mouseIsOver(sitZone)) {
    hasSatDown = true;
    return;
  }

  if (mouseIsOver(foodFightZone) && foodFightActive) {
    foodFightClicks++;
    if (foodFightClicks >= 10 && millis() - foodFightStartTime <= 5000) {
      alert("Your opponent gave up and left the dining hall!");
      opponentDefeated = true;
      foodFightActive = false;
      readyToLeave = true;
    }
    return;
  }

  if (mouseIsOver(exitZone)) {
    gameOver = true;
  }
}

function checkFoodFightTimeout() {
  if (millis() - foodFightStartTime > 5000 && foodFightActive) {
    alert("You are covered in food and should probably leave the dining hall.");
    foodFightActive = false;
  }
}

function displayEndScreen() {
  fill(0, 200, 0);
  rect(0, 0, width, height);
  fill(255);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(readyToLeave ? "You won the dining hall! You stayed the longest!" : "You lost the dining hall. Better luck next time!", width / 2, height / 2);
}

function mouseIsOver(zone) {
  return mouseX > zone.x && mouseX < zone.x + zone.w && mouseY > zone.y && mouseY < zone.y + zone.h;
}
