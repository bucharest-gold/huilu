'use strict';

let hbs = require('handlebars');
let fs = require('fs');
let path = require('path');
let svgTemplateFile = path.join(__dirname, 'svg.hbs');
let svgHbs = fs.readFileSync(svgTemplateFile, 'utf8');
let svgTemplate = hbs.compile(svgHbs);

/**
 * The template function to be used server side.
 *
 * @name svgTemplate
 * @private
 * @function
 */
module.exports = svgTemplate;
