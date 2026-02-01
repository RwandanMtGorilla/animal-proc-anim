/**
 * Snake class - Wiggly lil dude
 * Features a long 48-segment chain for smooth undulation
 * Migrated from Processing Snake.pde
 * @module animals/Snake
 */

import { Chain } from '../core/Chain.js';

/**
 * Snake character with undulating body animation
 */
export class Snake {
  /**
   * @param {p5.Vector} origin - Starting position
   */
  constructor(origin) {
    this.spine = new Chain(origin, 48, 64, PI/8);
    this.bodyColor = color(172, 57, 49);
  }

  /**
   * Update snake position to follow mouse
   */
  resolve() {
    const headPos = this.spine.joints[0];
    const mousePos = createVector(mouseX, mouseY);
    const targetPos = p5.Vector.add(
      headPos,
      p5.Vector.sub(mousePos, headPos).setMag(8)
    );
    this.spine.resolve(targetPos);
  }

  /**
   * Render the snake
   */
  display() {
    strokeWeight(4);
    stroke(255);
    fill(this.bodyColor);

    // === START BODY ===
    beginShape();

    // Right half of the snake
    for (let i = 0; i < this.spine.joints.length; i++) {
      curveVertex(this._getPosX(i, PI/2, 0), this._getPosY(i, PI/2, 0));
    }

    curveVertex(this._getPosX(47, PI, 0), this._getPosY(47, PI, 0));

    // Left half of the snake
    for (let i = this.spine.joints.length - 1; i >= 0; i--) {
      curveVertex(this._getPosX(i, -PI/2, 0), this._getPosY(i, -PI/2, 0));
    }

    // Top of the head (completes the loop)
    curveVertex(this._getPosX(0, -PI/6, 0), this._getPosY(0, -PI/6, 0));
    curveVertex(this._getPosX(0, 0, 0), this._getPosY(0, 0, 0));
    curveVertex(this._getPosX(0, PI/6, 0), this._getPosY(0, PI/6, 0));

    // Some overlap needed because curveVertex requires extra vertices that are not rendered
    curveVertex(this._getPosX(0, PI/2, 0), this._getPosY(0, PI/2, 0));
    curveVertex(this._getPosX(1, PI/2, 0), this._getPosY(1, PI/2, 0));
    curveVertex(this._getPosX(2, PI/2, 0), this._getPosY(2, PI/2, 0));

    endShape(CLOSE);
    // === END BODY ===

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
   * Calculate body width at segment i (tapered towards tail)
   * @param {number} i - Segment index
   * @returns {number} Body width at this segment
   * @private
   */
  _bodyWidth(i) {
    switch(i) {
      case 0:
        return 76;
      case 1:
        return 80;
      default:
        return 64 - i;
    }
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
           (this._bodyWidth(i) + lengthOffset);
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
           (this._bodyWidth(i) + lengthOffset);
  }
}
