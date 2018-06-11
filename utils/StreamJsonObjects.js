'use strict';

const {Transform} = require('stream');

const Assembler = require('./Assembler');
const withParser = require('./withParser');

class StreamJsonObjects extends Transform {
  static streamJsonObjects(options) {
    return new StreamJsonObjects(options);
  }

  constructor(options) {
    super(Object.assign({}, options, {writableObjectMode: true, readableObjectMode: true}));
    this._assembler = null;
    this._counter = this._depth = 0;
  }

  _transform(chunk, encoding, callback) {
    if (!this._assembler) {
      this._assembler = new Assembler();
    }

    if (this._assembler[chunk.name]) {
      this._assembler[chunk.name](chunk.value);

      switch (chunk.name) {
        case 'startObject':
        case 'startArray':
          ++this._depth;
          break;
        case 'endObject':
        case 'endArray':
          --this._depth;
          break;
      }

      if (!this._depth) {
        this.push({index: this._counter++, value: this._assembler.current});
        this._assembler.current = this._assembler.key = null;
      }
    }

    callback(null);
  }

  static withParser(options) {
    return withParser(StreamJsonObjects.make, Object.assign({}, options, {jsonStreaming: true}));
  }
}
StreamJsonObjects.make = StreamJsonObjects.streamJsonObjects;

module.exports = StreamJsonObjects;
