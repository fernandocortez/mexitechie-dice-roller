/**
 * @param {number} size Number of integers to generate
 * @returns {Uint32Array[]}
 */
function getRandomUnsignedIntegers(size) {
  const randomNumbers = new Uint32Array(size);
  self.crypto.getRandomValues(randomNumbers);
  return randomNumbers;
}

/**
 * @param {number} sides The number of sides on the die
 * @returns {number} The rolled result of the die
 */
export function getDieRoll(sides) {
  return (getRandomUnsignedIntegers(1)[0] % sides) + 1;
}

/**
 * @param {number[]} size The sides of all the dice to be rolled
 * @returns {number[]} The rolled result of all the dice
 */
export function getDiceResults(diceSides) {
  const size = diceSides.length;
  return Array.from(getRandomUnsignedIntegers(size)).map((n, index) => {
    const sides = diceSides[index];
    return (n % sides) + 1;
  });
}
