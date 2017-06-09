'use strict';

const format = require('util').format;

const scalarReverse = (s) => s.split('').reverse().join('');

const nameHash = (name) => {
  // Generate a vector hash for the name string, weighting early over
  // later characters. We want to pick the same colors for function
  // names across different flame graphs.
  let vector = 0;
  let weight = 1;
  let max = 1;
  let mod = 10;
  let ord;

  // if module name present, trunc to 1st char
  name = name.replace(/.(.*?)`/, '');
  let splits = name.split('');
  for (let i = 0; i < splits.length; i++) {
    ord = splits[i].charCodeAt(0) % mod;
    vector += (ord / (mod++ - 1)) * weight;
    max += weight;
    weight *= 0.70;
    if (mod > 12) break;
  }

  return (1 - vector / max);
};

const color = (type, hash, name) => {
  let v1, v2, v3, r, g, b;
  if (!type) return 'rgb(0, 0, 0)';

  if (hash) {
    v1 = nameHash(name);
    v2 = v3 = nameHash(scalarReverse(name));
  } else {
    v1 = Math.random() + 1;
    v2 = Math.random() + 1;
    v3 = Math.random() + 1;
  }

  switch (type) {
    case 'hot':
      r = 205 + Math.round(50 * v3);
      g = 0 + Math.round(230 * v1);
      b = 0 + Math.round(55 * v2);
      return format('rgb(%s, %s, %s)', r, g, b);
    case 'mem':
      r = 0;
      g = 190 + Math.round(50 * v2);
      b = 0 + Math.round(210 * v1);
      return format('rgb(%s, %s, %s)', r, g, b);
    case 'io':
      r = 80 + Math.round(60 * v1);
      g = r;
      b = 190 + Math.round(55 * v2);
      return format('rgb(%s, %s, %s)', r, g, b);
    default:
      throw new Error('Unknown type ' + type);
  }
};

/**
 * Maps a function name to a color, while trying to create same colors for similar functions.
 *
 * @name colorMap
 * @function
 * @private
 * @param {Object.<string, string>} paletteMap current map of colors `func: color`
 * @param {string} colorTheme theme of colors to be used `hot | mem | io`
 * @param {boolean} hash if true colors will be created from name hash, otherwise they are random
 * @param {string} func the function name for which to select a color
 * @return {string} containing an rgb color, i.e. `'rgb(1, 2, 3)'`
 */
const colorMap = (paletteMap, colorTheme, hash, func) => {
  if (paletteMap[func]) return paletteMap[func];
  paletteMap[func] = color(colorTheme, hash, func);
  return paletteMap[func];
};

module.exports = {
  colorMap: colorMap
};
