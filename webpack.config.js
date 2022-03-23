const path = require( "path" );

module.exports = {

    entry: "./src/index.js",

    output: {

        path: path.resolve( __dirname, "dist" ),

        filename: "font-caster.js",

        library: {

            name: "font-caster",

            type: "umd",

        },

    },

    target: "node",

    mode: "production",

};
