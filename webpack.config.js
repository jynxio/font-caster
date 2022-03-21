const path = require( "path" );

module.exports = {

    entry: "./src/index.js",

    output: {

        path: path.resolve( __dirname, "dist" ),

        filename: "fontknife.js",

        library: {

            name: "fontknife",

            type: "umd",

        },

    },

    target: "node",

    mode: "production",

};
