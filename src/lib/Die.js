/**
 * @module Die
 */
export class Die {
  /** @private @type {number} */
  #result;
  /** @private @type {number} */
  #sides;

  /**
   * @param {number} sides The number of sides on the die
   * @param {number} result The rolled result of the die
   */
  constructor(sides, result) {
    if (!Number.isFinite(sides)) {
      throw new Error('Die sides must be a number');
    } else if (sides < 1) {
      throw new Error('Die sides must be non-zero, positive');
    } else if (sides < 2) {
      throw new Error('A die must have at least 2 sides');
    }

    this.#result = Math.floor(result);
    this.#sides = Math.floor(sides);
  }

  /**
   * @returns {number} The rolled result of the die
   */
  get result() {
    return this.#result;
  }

  /**
   * @param {number} result The rolled result of the die
   */
  updateResult(result) {
    return new Die(this.#sides, result);
  }

  /**
   * @returns {number} The number of sides on the die
   */
  get sides() {
    return this.#sides;
  }
}
