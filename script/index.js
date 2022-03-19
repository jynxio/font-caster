const subset = require( "./subset" );

const read = require( "./read" );

const write = require( "./write" );

const parseHtml = require( "./parseHtml" );

const convert = require( "./convert" );

const fontcutter = {

    subset,

    read,

    write,

    parseHtml,

    convert,

};

module.exports = fontcutter;
