'use strict';

var xtend           = require('xtend')
  , contextify      = require('./contextify')
  , svgTemplate     = require('./svg-template')
  , defaultOpts     = require('./default-opts')

function narrowify(context, opts) {
  function processNode(n) {
    n.class = n.narrow ? 'hidden' : '';
  }

  function filterNode(n) {
    return !n.narrow;
  }

  if (opts.removenarrows) context.nodes = context.nodes.filter(filterNode);
  else context.nodes.forEach(processNode);
}

var go = module.exports = 

/**
 * Creates a context from a call graph that has been collapsed (`stackcollapse-*`) and renders svg from it.
 * 
 * @name flamegraph::svg 
 * @function
 * @param {Array.<string>} collapsedLines callgraph that has been collapsed
 * @param {Object} opts options
 * @return {string} svg 
 */
function svg(processedCpuProfile, opts) {
  opts = xtend(defaultOpts, opts);

  var context = contextify(processedCpuProfile, opts)

  narrowify(context, opts);

  return svgTemplate(context);
}
