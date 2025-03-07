let handPose;
let video;
let hands = [];

let drawing = false; // Flag for whether the user is drawing
let brushSize = 10; // Base brush stroke size
let drawings = []; // Store drawn points
let explosions = []; // Store explosion particles
let lastX, lastY; // Store previous position for smoother strokes

function preload() {
  handPose = ml5.handPose({ flipped: true }); // Ensures correct hand tracking
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, { flipped: true }); // Flips the webcam feed automatically
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);
}

function draw() {
  background(5, 0, 15, 20); // Darker synthwave background with slow fade

  // Display the correctly flipped webcam feed
  image(video, 0, 0, width, height);

  if (hands.length > 0) {
    let hand = hands[0];

    // Get index finger tip (keypoint 8) and thumb tip (keypoint 4)
    let indexFinger = hand.keypoints[8];
    let thumb = hand.keypoints[4];

    // Check if fingers are touching
    let distance = dist(indexFinger.x, indexFinger.y, thumb.x, thumb.y);
    drawing = distance < 30; // Draw if the distance is small (touching)

    if (drawing) {
      let x = indexFinger.x;
      let y = indexFinger.y;

      // Neon synthwave colors that cycle over time
      let brushColor = color(
        sin(frameCount * 0.1) * 127 + 128, 
        sin(frameCount * 0.07 + PI / 3) * 127 + 128, 
        sin(frameCount * 0.05 + PI / 1.5) * 127 + 128
      );

      // Line width based on movement speed
      let speed = lastX ? dist(x, y, lastX, lastY) : 0;
      let dynamicSize = constrain(brushSize + speed / 3, 8, 30);

      if (lastX !== undefined && lastY !== undefined) {
        let segmentLength = dist(lastX, lastY, x, y);

        if (segmentLength > 10) {  // 🔥 Only check for intersections if the segment is long enough
          let crossingEffect = false;
          let explosionX, explosionY;
          
          for (let point of drawings) {
            if (lineIntersects(point.x1, point.y1, point.x2, point.y2, lastX, lastY, x, y)) {
              crossingEffect = true;
              explosionX = (point.x1 + point.x2) / 2;
              explosionY = (point.y1 + point.y2) / 2;
              break;
            }
          }

          if (crossingEffect) {
            // Trigger an electric explosion at the crossing point
            createElectricExplosion(explosionX, explosionY);
          }
        }

        // Store drawn lines in an array to persist longer
        drawings.push({
          x1: lastX + random(-1, 1), // Glitch effect
          y1: lastY + random(-1, 1),
          x2: x + random(-1, 1),
          y2: y + random(-1, 1),
          color: brushColor,
          size: dynamicSize,
          life: 300 // Fades out even slower
        });
      }

      lastX = x;
      lastY = y;
    } else {
      // Reset last position when not drawing to avoid connecting random lines
      lastX = undefined;
      lastY = undefined;
    }
  }

  // Draw all stored strokes with a neon fading effect
  for (let i = drawings.length - 1; i >= 0; i--) {
    let point = drawings[i];

    // Outer glow effect
    stroke(point.color.levels[0], point.color.levels[1], point.color.levels[2], point.life / 2);
    strokeWeight(point.size * 2);
    line(point.x1, point.y1, point.x2, point.y2);

    // Main bright stroke
    stroke(point.color.levels[0], point.color.levels[1], point.color.levels[2], point.life);
    strokeWeight(point.size);
    line(point.x1, point.y1, point.x2, point.y2);

    // Apply fade effect over time
    point.life -= 2;
    if (point.life <= 0) {
      drawings.splice(i, 1); // Remove faded strokes
    }
  }

  // Draw and update explosions
  for (let i = explosions.length - 1; i >= 0; i--) {
    explosions[i].update();
    explosions[i].show();
    if (explosions[i].life <= 0) {
      explosions.splice(i, 1); // Remove finished explosions
    }
  }
}

// Function to detect if two line segments intersect
function lineIntersects(x1, y1, x2, y2, x3, y3, x4, y4) {
  function ccw(ax, ay, bx, by, cx, cy) {
    return (cy - ay) * (bx - ax) > (by - ay) * (cx - ax);
  }
  
  return ccw(x1, y1, x3, y3, x4, y4) !== ccw(x2, y2, x3, y3, x4, y4) &&
         ccw(x1, y1, x2, y2, x3, y3) !== ccw(x1, y1, x2, y2, x4, y4);
}

// Function to create an electric explosion at a given position
function createElectricExplosion(x, y) {
  for (let i = 0; i < 20; i++) {
    explosions.push(new ElectricArc(x, y));
  }
}

// Electric arc explosion effect
class ElectricArc {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
    this.length = random(5, 30);
    this.life = 255;
    this.color = color(255, random(100, 255), random(200, 255)); // Bright electric blue
  }

  update() {
    this.life -= 8; // Fade out quickly
  }

  show() {
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.life);
    strokeWeight(2);
    let x2 = this.x + cos(this.angle) * this.length;
    let y2 = this.y + sin(this.angle) * this.length;
    line(this.x, this.y, x2, y2);
  }
}

function gotHands(results) {
  hands = results;
}
