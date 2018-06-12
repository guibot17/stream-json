'use strict';

const Parser = require('./Parser');
const emit = require('./utils/emit');

const make = options => {
  if (!options || !('packValues' in options || 'packKeys' in options || 'packStrings' in options || 'packNumbers' in options)) {
    options = Object.assign({}, options, {packValues: true});
  }
  return emit(new Parser(options));
};
make.Parser = Parser;
make.parser = Parser.parser;

module.exports = make;
