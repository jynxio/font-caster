const fs = require( "fs" );

const refineFont = require( "./refineFont" );

const parseHtml = require( "./parseHtml" );

/* ---------------------------------------------------------------------------- -------------------*/

readHtmlFile( "./static/html/test.html" ).then( html => {

    const test = parseHtml( html );

    console.log( test );

} );

/**
 * 异步读取html文件，返回html文件的内容（字符串）。
 * @param {string} path - html文件的地址，比如"./test.html"。
 * @returns {Promise} - Promise代表html文件的内容。
 */
function readHtmlFile( path ) {

    return new Promise( resolve => {

        let html = "";

        const reader = fs.createReadStream( path, { encoding: "utf8" } );

        reader.on( "data", chunk => html += chunk );
        reader.on( "end", _ => resolve( html ) );

    } );

}

// refineEnglishFontFile();
// refineChineseFontFile();

function refineEnglishFontFile() {

    const characters = "abcd1234,.?";
    const path_1 = "./static/font/full/IBMPlexSerif-ExtraLight.ttf";
    const path_2 = "./static/font/condensed";

    refineFont( characters, path_1, path_2 ).then( response => {

        response && console.log( "🟢 English font file had been refined." );

    } );

}

function refineChineseFontFile() {

    const characters = "你我他，。？";
    const path_1 = "./static/font/full/NotoSansSC-Thin.ttf";
    const path_2 = "./static/font/condensed";

    refineFont( characters, path_1, path_2 ).then( response => {

        response && console.log( "🟢 Chinese font file had been refined." );

    } );

}
