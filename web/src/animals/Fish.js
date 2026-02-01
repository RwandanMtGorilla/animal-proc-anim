/**
 * Fish class - Bloopy lil dude
 * Features complex fin rendering and smooth swimming animation
 * Migrated from Processing Fish.pde
 * @module animals/Fish
 */

import { Chain } from '../core/Chain.js';
import { relativeAngleDiff } from '../utils/geometry.js';

/**
 * Fish character with procedural swimming animation
 * Features: body segments, pectoral fins, ventral fins, caudal fin, dorsal fin
 */
export class Fish {
  /**
   * @param {p5.Vector} origin - Starting position
   */
  constructor(origin) {
    // 12 segments, first 10 for body, last 2 for caudal fin
    this.spine = new Chain(origin, 12, 64, PI/8);

    this.bodyColor = color(58, 124, 165);
    this.finColor = color(129, 195, 215);

    // Width of the fish at each vertebra
    this.bodyWidth = [68, 81, 84, 83, 77, 64, 51, 38, 32, 19];

    // Movement control parameters
    this.lastDirection = createVector(1, 0);  // Initial direction
    this.maxTurnAngle = PI / 6;  // Maximum turn angle per frame: 30 degrees
  }

  /**
   * Update fish position to follow mouse with smooth turning
   */
  resolve() {
    const headPos = this.spine.joints[0];
    const mousePos = createVector(mouseX, mouseY);
    const distToMouse = p5.Vector.dist(headPos, mousePos);

    // Prevent jittering when too close to mouse
    if (distToMouse < 25) {
      return;
    }

    // Calculate desired direction
    const desiredDirection = p5.Vector.sub(mousePos, headPos).normalize();

    // Calculate angle difference
    const currentAngle = this.lastDirection.heading();
    const desiredAngle = desiredDirection.heading();
    let angleDiff = desiredAngle - currentAngle;

    // Handle angle wrapping (-PI to PI)
    while (angleDiff > PI) angleDiff -= TWO_PI;
    while (angleDiff < -PI) angleDiff += TWO_PI;

    // Constrain turn rate
    const actualAngleDiff = constrain(angleDiff, -this.maxTurnAngle, this.maxTurnAngle);
    const newAngle = currentAngle + actualAngleDiff;
    this.lastDirection = p5.Vector.fromAngle(newAngle);

    // Apply movement
    const targetPos = p5.Vector.add(headPos, p5.Vector.mult(this.lastDirection, 16));
    this.spine.resolve(targetPos);
  }

  /**
   * Render the fish with all body parts
   */
  display() {
    strokeWeight(4);
    stroke(255);
    fill(this.finColor);

    // Shorthand references for cleaner code
    const j = this.spine.joints;
    const a = this.spine.angles;

    // Relative angle differences are used in some hacky computation for the dorsal fin
    const headToMid1 = relativeAngleDiff(a[0], a[6]);
    const headToMid2 = relativeAngleDiff(a[0], a[7]);

    // For the caudal fin, we need to compute the relative angle difference from the head to the tail, but given
    // a joint count of 12 and angle constraint of PI/8, the maximum difference between head and tail is 11PI/8,
    // which is >PI. This complicates the relative angle calculation (flips the sign when curving too tightly).
    // A quick workaround is to compute the angle difference from the head to the middle of the fish, and then
    // from the middle of the fish to the tail.
    const headToTail = headToMid1 + relativeAngleDiff(a[6], a[11]);

    // === START PECTORAL FINS ===
    push();
    translate(this._getPosX(3, PI/3, 0), this._getPosY(3, PI/3, 0));
    rotate(a[2] - PI/4);
    ellipse(0, 0, 160, 64); // Right
    pop();
    push();
    translate(this._getPosX(3, -PI/3, 0), this._getPosY(3, -PI/3, 0));
    rotate(a[2] + PI/4);
    ellipse(0, 0, 160, 64); // Left
    pop();
    // === END PECTORAL FINS ===

    // === START VENTRAL FINS ===
    push();
    translate(this._getPosX(7, PI/2, 0), this._getPosY(7, PI/2, 0));
    rotate(a[6] - PI/4);
    ellipse(0, 0, 96, 32); // Right
    pop();
    push();
    translate(this._getPosX(7, -PI/2, 0), this._getPosY(7, -PI/2, 0));
    rotate(a[6] + PI/4);
    ellipse(0, 0, 96, 32); // Left
    pop();
    // === END VENTRAL FINS ===

    // === START CAUDAL FINS ===
    beginShape();
    // "Bottom" of the fish
    for (let i = 8; i < 12; i++) {
      const tailWidth = 1.5 * headToTail * (i - 8) * (i - 8);
      curveVertex(j[i].x + cos(a[i] - PI/2) * tailWidth, j[i].y + sin(a[i] - PI/2) * tailWidth);
    }

    // "Top" of the fish
    for (let i = 11; i >= 8; i--) {
      const tailWidth = max(-13, min(13, headToTail * 6));
      curveVertex(j[i].x + cos(a[i] + PI/2) * tailWidth, j[i].y + sin(a[i] + PI/2) * tailWidth);
    }
    endShape(CLOSE);
    // === END CAUDAL FINS ===

    fill(this.bodyColor);

    // === START BODY ===
    beginShape();

    // Right half of the fish
    for (let i = 0; i < 10; i++) {
      curveVertex(this._getPosX(i, PI/2, 0), this._getPosY(i, PI/2, 0));
    }

    // Bottom of the fish
    curveVertex(this._getPosX(9, PI, 0), this._getPosY(9, PI, 0));

    // Left half of the fish
    for (let i = 9; i >= 0; i--) {
      curveVertex(this._getPosX(i, -PI/2, 0), this._getPosY(i, -PI/2, 0));
    }

    // Top of the head (completes the loop)
    curveVertex(this._getPosX(0, -PI/6, 0), this._getPosY(0, -PI/6, 0));
    curveVertex(this._getPosX(0, 0, 4), this._getPosY(0, 0, 4));
    curveVertex(this._getPosX(0, PI/6, 0), this._getPosY(0, PI/6, 0));

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    curveVertex(this._getPosX(0, PI/2, 0), this._getPosY(0, PI/2, 0));
    curveVertex(this._getPosX(1, PI/2, 0), this._getPosY(1, PI/2, 0));
    curveVertex(this._getPosX(2, PI/2, 0), this._getPosY(2, PI/2, 0));

    endShape(CLOSE);
    // === END BODY ===

    fill(this.finColor);

    // === START DORSAL FIN ===
    beginShape();
    vertex(j[4].x, j[4].y);
    bezierVertex(j[5].x, j[5].y, j[6].x, j[6].y, j[7].x, j[7].y);
    bezierVertex(
      j[6].x + cos(a[6] + PI/2) * headToMid2 * 16,
      j[6].y + sin(a[6] + PI/2) * headToMid2 * 16,
      j[5].x + cos(a[5] + PI/2) * headToMid1 * 16,
      j[5].y + sin(a[5] + PI/2) * headToMid1 * 16,
      j[4].x,
      j[4].y
    );
    endShape();
    // === END DORSAL FIN ===

    // === START EYES ===
    fill(255);
    ellipse(this._getPosX(0, PI/2, -18), this._getPosY(0, PI/2, -18), 24, 24);
    ellipse(this._getPosX(0, -PI/2, -18), this._getPosY(0, -PI/2, -18), 24, 24);
    // === END EYES ===
  }

  /**
   * Debug display showing spine structure
   */
  debugDisplay() {
    this.spine.display();
  }

  /**
   * Get X coordinate on body surface
   * @param {number} i - Segment index
   * @param {number} angleOffset - Angle offset from spine direction (radians)
   * @param {number} lengthOffset - Additional offset from body surface
   * @returns {number} X coordinate
   * @private
   */
  _getPosX(i, angleOffset, lengthOffset) {
    return this.spine.joints[i].x +
           cos(this.spine.angles[i] + angleOffset) *
           (this.bodyWidth[i] + lengthOffset);
  }

  /**
   * Get Y coordinate on body surface
   * @param {number} i - Segment index
   * @param {number} angleOffset - Angle offset from spine direction (radians)
   * @param {number} lengthOffset - Additional offset from body surface
   * @returns {number} Y coordinate
   * @private
   */
  _getPosY(i, angleOffset, lengthOffset) {
    return this.spine.joints[i].y +
           sin(this.spine.angles[i] + angleOffset) *
           (this.bodyWidth[i] + lengthOffset);
  }
}
