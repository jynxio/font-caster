const fontFilter = require( "./fontFilter" );

const characters = "abc123";
const path_1 = "./static/font/full/great-vibes-regular.ttf";
const path_2 = "./static/font/condensed";

fontFilter( characters, path_1, path_2 ).then( response => {

    console.log( response );

} );
