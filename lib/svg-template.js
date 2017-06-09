'use strict';

const hbs = require('handlebars');
const fs = require('fs');
const path = require('path');
const svgTemplateFile = path.join(__dirname, 'svg.hbs');
const svgHbs = fs.readFileSync(svgTemplateFile, 'utf8');
const svgTemplate = hbs.compile(svgHbs);

/**
 * The template function to be used server side.
 *
 * @name svgTemplate
 * @private
 * @function
 */
module.exports = svgTemplate;
