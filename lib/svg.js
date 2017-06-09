'use strict';

const xtend = require('xtend');
const contextify = require('./contextify');
const svgTemplate = require('./svg-template');
const defaultOpts = require('./default-opts');

const narrowify = (context, opts) => {
  const processNode = (n) => {
    n.class = n.narrow ? 'hidden' : '';
  };

  const filterNode = (n) => !n.narrow;

  if (opts.removenarrows) context.nodes = context.nodes.filter(filterNode);
  else context.nodes.forEach(processNode);
};

/**
 * Creates a context from a call graph that has been collapsed (`stackcollapse-*`) and renders svg from it.
 *
 * @name flamegraph::svg
 * @function
 * @param {Array.<string>} collapsedLines callgraph that has been collapsed
 * @param {Object} opts options
 * @return {string} svg
 */
const svg = (processedCpuProfile, opts) => {
  opts = xtend(defaultOpts, opts);
  let context = contextify.contextify(processedCpuProfile, opts);
  narrowify(context, opts);
  return svgTemplate(context);
};

module.exports = {
  svg: svg
};
