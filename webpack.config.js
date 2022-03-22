const path = require( "path" );

module.exports = {

    entry: "./src/index.js",

    output: {

        path: path.resolve( __dirname, "dist" ),

        filename: "fontcaster.js",

        library: {

            name: "fontcaster",

            type: "umd",

        },

    },

    target: "node",

    mode: "production",

};
