const refineFont = require( "./refineFont" );

refineEnglishFontFile();
refineChineseFontFile();

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
