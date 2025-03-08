let grammar;
let generatedText = "";
let posX = 0, posY = 0;
let boxWidth = 0, boxHeight = 0;
let clickCount = 0;
let velocityY = 0;
let accelerationY = 0.1;
let stationaryTime = 180;
let clearCounter = 0;
const clearInterval = 120;

const themes = {
  backgroundColors: ['#000', '#111', '#222', '#333', '#444', '#555', '#666', '#777', '#888', '#999'],
  textColors: ['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800', '#88ff00', '#8800ff'],
  fonts: ['Courier New', 'Arial', 'Verdana', 'Times New Roman', 'Georgia', 'Roboto', 'Montserrat', 'Raleway', 'Open Sans', 'Orbitron'],
  alienColors: ['#00ff00', '#ff0000', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ff8800', '#88ff00', '#8800ff']
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0, 0, 0, 0);
  textWrap(WORD);
  textAlign(CENTER, CENTER);
  textSize(32);
  fill(0, 255, 0);
  noLoop();

  $.getJSON("grammar.json", function(data) {
    grammar = tracery.createGrammar(data);
    updateText();
  });

  addAliens();
}

function updateText() {
  if (grammar) {
    let part = "";
    switch (clickCount % 4) {
      case 0:
        part = "#intro#";
        break;
      case 1:
        part = "#conflict#";
        break;
      case 2:
        part = "#twist#";
        break;
      case 3:
        part = "#resolution#";
        break;
    }
    generatedText = grammar.flatten(part);
    boxWidth = width * 0.5;
    boxHeight = height * 0.5;
    redraw();

    if (clickCount % 4 === 3) {
      changeTheme();
    }
  }
}

function draw() {
  if (clearCounter >= clearInterval) {
    clear();
    clearCounter = 0;
  } else {
    clearCounter++;
  }

  fill(0, 255, 0);
  text(generatedText, posX, posY, boxWidth, boxHeight);

  if (stationaryTime > 0) {
    stationaryTime--;
  } else {
    posY += velocityY;
    velocityY += accelerationY;
  }

  if (posY < height + boxHeight) {
    requestAnimationFrame(draw);
  }
}

function mousePressed() {
  clickCount++;
  updateText();
  posX = mouseX - boxWidth / 2;
  posY = mouseY - boxHeight / 2;
  velocityY = 0;
  stationaryTime = 180;
  draw();
}

function touchStarted() {
  mousePressed();
}

function addAliens() {
  const alienTemplate = document.getElementById('alien-template');
  const alienWidth = 50;
  const numAliens = Math.floor(window.innerWidth / alienWidth);

  for (let i = 0; i < numAliens; i++) {
    const alienClone = alienTemplate.cloneNode(true);
    alienClone.style.display = 'block';
    alienClone.style.left = `${i * alienWidth}px`;
    alienClone.classList.add('alien');
    document.body.appendChild(alienClone);
  }
}

function changeTheme() {
  const backgroundColor = themes.backgroundColors[Math.floor(Math.random() * themes.backgroundColors.length)];
  const textColor = themes.textColors[Math.floor(Math.random() * themes.textColors.length)];
  const font = themes.fonts[Math.floor(Math.random() * themes.fonts.length)];
  const alienColor = themes.alienColors[Math.floor(Math.random() * themes.alienColors.length)];

  document.body.style.backgroundColor = backgroundColor;
  document.body.style.color = textColor;
  document.body.style.fontFamily = font;

  const alienBodies = document.querySelectorAll('.alien circle');
  const alienTentacles = document.querySelectorAll('.alien line');
  const alienFangs = document.querySelectorAll('.alien line[stroke-width="2"]');

  alienBodies.forEach(alien => {
    alien.setAttribute('fill', alienColor);
  });

  alienTentacles.forEach(alien => {
    alien.setAttribute('stroke', alienColor);
  });

  alienFangs.forEach(alien => {
    alien.setAttribute('stroke', '#000');
  });

  const alienEyes = document.querySelectorAll('.alien circle:nth-child(2), .alien circle:nth-child(3), .alien circle:nth-child(4)');
  alienEyes.forEach(alien => {
    alien.setAttribute('fill', '#000');
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
