'use strict';

const xtend = require('xtend');
const format = require('util').format;
const colorMap = require('./color-map');

// TODO: fix unused - remove this when thigs get stable.
// function inspect (obj, depth) {
//   console.error(require('util').inspect(obj, false, depth || 5, true));
// }

const oneDecimal = (x) => (Math.round(x * 10) / 10);
const htmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Extracts a context object from the parsed callgraph @see `stackparse.js`.
 * This context can then be used to generate the svg file via a template.
 *
 * @name contextify
 * @private
 * @function
 * @param {Object} parsed nodes
 * @param {Object} opts options that affect visual and how the nodes are filtered
 */
// Contextifier proto
function contextify (parsed, opts) {
  let time = parsed.time;
  let timeMax = opts.timemax;
  let ypadTop = opts.fontsize * 4; // pad top, include title
  let ypadBottom = opts.fontsize * 2 + 10; // pad bottom, include labels
  let xpad = 10; // pad left and right
  let depthMax = 0;
  let frameHeight = opts.frameheight;
  let paletteMap = {};

  if (timeMax < time && timeMax / time > 0.02) {
    console.error('Specified timemax %d is less than actual total %d, so it will be ignored', timeMax, time);
    timeMax = Infinity;
  }

  timeMax = Math.min(time, timeMax);

  let widthPerTime = (opts.imagewidth - 2 * xpad) / timeMax;
  let minWidthTime = opts.minwidth / widthPerTime;

  function markNarrowBlocks (nodes) {
    function mark (k) {
      var val = parsed.nodes[k];
      if (typeof val.stime !== 'number') throw new Error('Missing start for ' + k);
      if ((val.etime - val.stime) < minWidthTime) {
        val.narrow = true;
        return;
      }

      val.narrow = false;
      depthMax = Math.max(val.depth, depthMax);
    }

    Object.keys(nodes).forEach(mark);
  }

  // NodeProcessor proto
  function processNode (node) {
    let func = node.func;
    let depth = node.depth;
    let etime = node.etime;
    let stime = node.stime;
    let factor = opts.factor;
    let countName = opts.countname;
    let isRoot = !func.length && depth === 0;

    if (isRoot) etime = timeMax;

    let samples = Math.round((etime - stime * factor) * 10) / 10;
    let samplesTxt = samples.toLocaleString();
    let pct;
    let pctTxt;
    let escapedFunc;
    let name;
    let sampleInfo;

    if (isRoot) {
      name = 'all';
      sampleInfo = format('(%s %s, 100%)', samplesTxt, countName);
    } else {
      pct = Math.round((100 * samples) / (timeMax * factor) * 10) / 10;
      pctTxt = pct.toLocaleString();
      escapedFunc = htmlEscape(func);

      name = escapedFunc;
      sampleInfo = format('(%s %s), %s%%)', samplesTxt, countName, pctTxt);
    }

    let x1 = oneDecimal(xpad + stime * widthPerTime);
    let x2 = oneDecimal(xpad + etime * widthPerTime);
    let y1 = oneDecimal(imageHeight - ypadBottom - (depth + 1) * frameHeight + 1);
    let y2 = oneDecimal(imageHeight - ypadBottom - depth * frameHeight);
    let chars = (x2 - x1) / (opts.fontsize * opts.fontwidth);
    let showText = false;
    let text;

    if (chars >= 3) { // enough room to display function name?
      showText = true;
      text = func.slice(0, chars);
      if (chars < func.length) text = text.slice(0, chars - 2) + '..';
      text = htmlEscape(text);
    }

    return {
      name: name,
      search: name.toLowerCase(),
      samples: sampleInfo,
      rect_x: x1,
      rect_y: y1,
      rect_w: x2 - x1,
      rect_h: y2 - y1,
      rect_fill: colorMap.colorMap(paletteMap, opts.colors, opts.hash, func),
      text: text,
      text_x: x1 + (showText ? 3 : 0),
      text_y: 3 + (y1 + y2) / 2,
      narrow: node.narrow,
      func: htmlEscape(func)
    };
  }

  function processNodes (nodes) {
    const keys = Object.keys(nodes);
    let acc = new Array(keys.length);

    for (var i = 0; i < keys.length; i++) {
      acc[i] = processNode(nodes[keys[i]]);
    }
    return acc;
  }

  markNarrowBlocks(parsed.nodes);

  let imageHeight = (depthMax * frameHeight) + ypadTop + ypadBottom;
  let ctx = xtend(opts, {
    imageheight: imageHeight, xpad: xpad, titleX: opts.imagewidth / 2, detailsY: imageHeight - (frameHeight / 2)
  });

  ctx.nodes = processNodes(parsed.nodes);
  return ctx;
}

module.exports = {
  contextify: contextify
};
