# huilu

[![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/huilu/badge.svg)](https://coveralls.io/github/bucharest-gold/huilu)
[![Build Status](https://travis-ci.org/bucharest-gold/huilu.svg?branch=master)](https://travis-ci.org/bucharest-gold/huilu)
[![Known Vulnerabilities](https://snyk.io/test/npm/huilu/badge.svg)](https://snyk.io/test/npm/huilu)
[![dependencies Status](https://david-dm.org/bucharest-gold/huilu/status.svg)](https://david-dm.org/bucharest-gold/huilu)

[![NPM](https://nodei.co/npm/huilu.png)](https://npmjs.org/package/huilu)

Generates flamegraphs with Node.js

> Chinese mythology includes stories of Hui Lu, a magician and fire god who kept 100 firebirds in a gourd. By setting them loose, he could start a fire across the whole country.

|                 | Project Info  |
| --------------- | ------------- |
| License:        | MIT |
| Build:          | make |
| Documentation:  | N/A |
| Issue tracker:  | https://github.com/bucharest-gold/huilu/issues |
| Engines:        | Node.js 4.x, 5.x, 6.x |

## Installation

    npm install huilu -S

## Usage

    const fs = require('fs');
    const huilu = require('huilu');

    const stream = fs.createReadStream('v8.cpuprofile');
    const svg = fs.createWriteStream('graph.svg');
    huilu.fromStream(stream, {inputtype: 'cpuprofile'}).pipe(svg);

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md)