export const PUZZLE_COLUMNS = 4;
export const PUZZLE_ROWS = 2;
export const solvedTiles = () => Array.from({ length: PUZZLE_COLUMNS * PUZZLE_ROWS }, (_, index) => index);

/** @param {number[]} tiles */
export const isPuzzleSolved = (tiles) => tiles.length > 0 && tiles.every((piece, index) => piece === index);

/** @param {number[]} tiles @param {number} from @param {number} to */
export function swapTiles(tiles, from, to) {
  const next = [...tiles];
  if (![from, to].every(index => Number.isInteger(index) && index >= 0 && index < tiles.length)) return next;
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/** @param {() => number} random */
export function shuffleTiles(random = Math.random) {
  const next = solvedTiles();
  for (let index = next.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [next[index], next[other]] = [next[other], next[index]];
  }
  // A game must not begin already solved, even if the shuffle returned identity.
  return isPuzzleSolved(next) ? swapTiles(next, 0, 1) : next;
}
