import classNames from 'classnames';
import { produce } from 'immer';
import { useMemo, useState } from 'preact/hooks';
import { Die } from './lib/Die';
import { getDiceResults, getDieRoll } from './lib/generators';

/** @readonly @type {number[]} */
const polyhedrals = [4, 6, 8, 10, 12, 20, 100];

export function App() {
  const [dice, setDice] = useState([]);
  const [isViewOptionsShown, setIsViewOptionsShown] = useState(false);
  const [options, setOptions] = useState({
    alignAddDiceButtons: 'right',
    reverseAddDiceButtons: false,
    alignDiceControls: 'right',
    reverseDiceControls: true,
  });
  const results = useMemo(() => dice.map((die) => die.result), [dice]);

  /** @param {number} sides The number of sides new die has */
  const addDie = (sides) => {
    const result = getDieRoll(sides);
    setDice((prevState) => {
      return prevState.concat(new Die(sides, result));
    });
  };

  /** @param {number} index The index of the die in the array to be removed */
  const removeDie = (index) => {
    setDice(
      produce((dice) => {
        dice.splice(index, 1);
      })
    );
  };

  /** @param {number} index The index of the die in the array to be re-rolled */
  const rollDie = (index) => {
    const die = dice[index];
    const result = getDieRoll(die.sides);
    setDice(
      produce((dice) => {
        dice[index] = die.updateResult(result);
      })
    );
  };

  const rollAllDice = () => {
    const diceSides = dice.map((die) => die.sides);
    const newDiceResults = getDiceResults(diceSides);
    setDice(
      produce((dice) => {
        newDiceResults.forEach((result, index) => {
          const die = dice[index];
          dice[index] = die.updateResult(result);
        });
      })
    );
  };

  const clearDice = () => {
    setDice([]);
  };

  const toggleViewOptions = () => {
    setIsViewOptionsShown(!isViewOptionsShown);
  };

  const updateOptionsValueByKey = (option, value) => {
    return () => {
      setOptions(
        produce((options) => {
          options[option] = value;
        })
      );
    };
  };

  if (isViewOptionsShown) {
    return (
      <form class="flex flex-col gap-y-4 p-0.5">
        <p class="flex gap-x-1">
          Align dice buttons:
          <label>
            <input
              checked={options.alignAddDiceButtons === 'left'}
              name="align-dice-buttons"
              onInput={updateOptionsValueByKey('alignAddDiceButtons', 'left')}
              type="radio"
              value="left"
            />
            &nbsp;left
          </label>
          <label>
            <input
              checked={options.alignAddDiceButtons === 'right'}
              name="align-dice-buttons"
              onInput={updateOptionsValueByKey('alignAddDiceButtons', 'right')}
              type="radio"
              value="right"
            />
            &nbsp;right
          </label>
        </p>
        <p>
          <label>
            Reverse dice buttons:&nbsp;
            <input
              checked={options.reverseAddDiceButtons}
              onInput={updateOptionsValueByKey(
                'reverseAddDiceButtons',
                !options.reverseAddDiceButtons
              )}
              type="checkbox"
            />
          </label>
        </p>

        <p class="flex gap-x-1">
          Align control buttons:
          <label>
            <input
              checked={options.alignDiceControls === 'left'}
              name="align-dice-controls"
              onInput={updateOptionsValueByKey('alignDiceControls', 'left')}
              type="radio"
              value="left"
            />
            &nbsp;left
          </label>
          <label>
            <input
              checked={options.alignDiceControls === 'right'}
              name="align-dice-controls"
              onInput={updateOptionsValueByKey('alignDiceControls', 'right')}
              type="radio"
              value="right"
            />
            &nbsp;right
          </label>
        </p>
        <p>
          <label>
            Reverse dice buttons:&nbsp;
            <input
              checked={options.reverseDiceControls}
              onInput={updateOptionsValueByKey(
                'reverseDiceControls',
                !options.reverseDiceControls
              )}
              type="checkbox"
            />
          </label>
        </p>

        <button class="bg-indigo-500 rounded-md" onClick={toggleViewOptions}>
          Save
        </button>
      </form>
    );
  }

  return (
    <article
      class="gap-y-4 grid items-start p-2"
      style={{ gridTemplateRows: 'auto 1fr auto auto auto', height: '100vh' }}
    >
      <section class="flex gap-2 justify-center">
        <div>Total: {results.reduce((result, acc) => result + acc, 0)}</div>
        <div>|</div>
        <div>Max:&nbsp;{results.length === 0 ? 0 : Math.max(...results)}</div>
        <div>|</div>
        <div>Min:&nbsp;{results.length === 0 ? 0 : Math.min(...results)}</div>
      </section>

      <section class="flex flex-wrap gap-2">
        {dice.map((die, i) => {
          return (
            <div class="flex gap-x-1">
              <button
                class="bg-gray-500 p-2 rounded-md"
                onClick={() => rollDie(i)}
              >
                {die.result} (d{die.sides})
              </button>
              <button
                class="bg-gray-500 p-2 rounded-md"
                onClick={() => removeDie(i)}
              >
                &times;
              </button>
            </div>
          );
        })}
      </section>

      <hr />

      <section
        class={classNames('flex', 'flex-wrap', 'gap-2', {
          'justify-end':
            (!options.reverseAddDiceButtons &&
              options.alignAddDiceButtons === 'right') ||
            (options.reverseAddDiceButtons &&
              options.alignAddDiceButtons === 'left'),
          'flex-row-reverse': options.reverseAddDiceButtons,
        })}
      >
        {polyhedrals.map((sides) => {
          return (
            <button
              class="bg-gray-500 p-2 rounded-md"
              onClick={() => addDie(sides)}
            >{`+d${sides}`}</button>
          );
        })}
      </section>

      <section
        class={classNames('flex', 'gap-2', {
          'justify-end':
            (!options.reverseDiceControls &&
              options.alignDiceControls === 'right') ||
            (options.reverseDiceControls &&
              options.alignDiceControls === 'left'),
          'flex-row-reverse': options.reverseDiceControls,
        })}
      >
        <button class="bg-indigo-500 p-2 rounded-md" onClick={rollAllDice}>
          Roll All
        </button>
        <button class="bg-indigo-500 p-2 rounded-md" onClick={clearDice}>
          Clear
        </button>
        <button
          class="bg-indigo-500 p-2 rounded-md text-2xl"
          onClick={toggleViewOptions}
        >
          &#x2699;
        </button>
      </section>
    </article>
  );
}
