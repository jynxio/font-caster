const subset = require( "./subset" );

const read = require( "./read" );

const write = require( "./write" );

const parseHtml = require( "./parseHtml" );

const convert = require( "./convert" );

const deduplication = require( "./deduplication" );

const fontcaster = {

    subset,

    read,

    write,

    parseHtml,

    convert,

    deduplication,

};

module.exports = fontcaster;
