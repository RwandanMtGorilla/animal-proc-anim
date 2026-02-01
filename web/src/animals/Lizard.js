/**
 * Lizard class - Glitchy lil dude
 * Features four-legged walking animation using FABRIK IK
 * Migrated from Processing Lizard.pde
 * @module animals/Lizard
 */

import { Chain } from '../core/Chain.js';

/**
 * Lizard character with body and four legs using FABRIK IK
 */
export class Lizard {
  /**
   * @param {p5.Vector} origin - Starting position
   */
  constructor(origin) {
    this.spine = new Chain(origin, 14, 64, PI/8);

    // Four legs (front two longer than back two)
    this.arms = [];
    this.armDesired = [];
    for (let i = 0; i < 4; i++) {
      this.arms.push(new Chain(origin, 3, i < 2 ? 52 : 36));
      this.armDesired.push(createVector(0, 0));
    }

    this.bodyColor = color(82, 121, 111);

    // Width of the lizard at each vertebra
    this.bodyWidth = [52, 58, 40, 60, 68, 71, 65, 50, 28, 15, 11, 9, 7, 7];
  }

  /**
   * Update lizard position and leg IK
   */
  resolve() {
    const headPos = this.spine.joints[0];
    const mousePos = createVector(mouseX, mouseY);
    const targetPos = p5.Vector.add(
      headPos,
      p5.Vector.sub(mousePos, headPos).setMag(12)
    );
    this.spine.resolve(targetPos);

    // Update each leg with FABRIK
    for (let i = 0; i < this.arms.length; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      const bodyIndex = i < 2 ? 3 : 7; // Front/back attachment point
      const angle = i < 2 ? PI/4 : PI/3;

      const desiredPos = createVector(
        this._getPosX(bodyIndex, angle * side, 80),
        this._getPosY(bodyIndex, angle * side, 80)
      );

      // Step foot toward target if far enough (walking behavior)
      if (p5.Vector.dist(desiredPos, this.armDesired[i]) > 200) {
        this.armDesired[i] = desiredPos;
      }

      // Resolve arm IK (foot → shoulder)
      const footPos = p5.Vector.lerp(this.arms[i].joints[0], this.armDesired[i], 0.4);
      const shoulderPos = createVector(
        this._getPosX(bodyIndex, PI/2 * side, -20),
        this._getPosY(bodyIndex, PI/2 * side, -20)
      );
      this.arms[i].fabrikResolve(footPos, shoulderPos);
    }
  }

  /**
   * Render the lizard
   */
  display() {
    // === START ARMS (drawn first so they appear behind body) ===
    noFill();
    for (let i = 0; i < this.arms.length; i++) {
      const shoulder = this.arms[i].joints[2];
      const foot = this.arms[i].joints[0];
      let elbow = this.arms[i].joints[1].copy();

      // Doing a hacky thing to correct the back legs to be more physically accurate
      const para = p5.Vector.sub(foot, shoulder);
      const perp = createVector(-para.y, para.x).setMag(30);
      if (i === 2) {
        elbow = p5.Vector.sub(elbow, perp);
      } else if (i === 3) {
        elbow = p5.Vector.add(elbow, perp);
      }

      // Draw white outline
      strokeWeight(40);
      stroke(255);
      bezier(shoulder.x, shoulder.y, elbow.x, elbow.y, elbow.x, elbow.y, foot.x, foot.y);

      // Draw colored fill
      strokeWeight(32);
      stroke(this.bodyColor);
      bezier(shoulder.x, shoulder.y, elbow.x, elbow.y, elbow.x, elbow.y, foot.x, foot.y);
    }
    // === END ARMS ===

    strokeWeight(4);
    stroke(255);
    fill(this.bodyColor);

    // === START BODY ===
    beginShape();

    // Right half of the lizard
    for (let i = 0; i < this.spine.joints.length; i++) {
      curveVertex(this._getPosX(i, PI/2, 0), this._getPosY(i, PI/2, 0));
    }

    // Left half of the lizard
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      curveVertex(this._getPosX(i, -PI/2, 0), this._getPosY(i, -PI/2, 0));
    }

    // Top of the head (completes the loop)
    curveVertex(this._getPosX(0, -PI/6, -8), this._getPosY(0, -PI/6, -10));
    curveVertex(this._getPosX(0, 0, -6), this._getPosY(0, 0, -4));
    curveVertex(this._getPosX(0, PI/6, -8), this._getPosY(0, PI/6, -10));

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    curveVertex(this._getPosX(0, PI/2, 0), this._getPosY(0, PI/2, 0));
    curveVertex(this._getPosX(1, PI/2, 0), this._getPosY(1, PI/2, 0));
    curveVertex(this._getPosX(2, PI/2, 0), this._getPosY(2, PI/2, 0));

    endShape(CLOSE);
    // === END BODY ===

    // === START EYES ===
    fill(255);
    ellipse(this._getPosX(0, 3*PI/5, -7), this._getPosY(0, 3*PI/5, -7), 24, 24);
    ellipse(this._getPosX(0, -3*PI/5, -7), this._getPosY(0, -3*PI/5, -7), 24, 24);
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
