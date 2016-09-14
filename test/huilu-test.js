'use strict';

const test = require('tape');
const fs = require('fs');
const huilu = require('../from-stream');
const Fidelity = require('fidelity');
const path = require('path');

function createSvg () {
  let stream = fs.createReadStream(path.join(__dirname, '/fixtures/v8-profiler.cpuprofile'));
  const svg = fs.createWriteStream(path.join(__dirname, '/file.svg'));
  const promise = new Fidelity((resolve, reject) => {
    resolve(huilu.fromStream(stream, {inputtype: 'cpuprofile'})
      .pipe(svg));
  });
  return promise;
}

test('Should create svg file', t => {
  createSvg().then(x => {
    try {
      fs.statSync(path.join(__dirname, 'file.svg'));
      t.equal(1, 1);
      t.end();
    } catch (e) {
      console.error(e);
      t.fail(e);
    }
  }).catch(e => {
    console.error(e);
    t.fail();
  });
});
