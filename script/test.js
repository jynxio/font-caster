const opentype = require( "opentype.js" );

const read = require( "/script/read" );

testReadDirectory();

function testReadDirectory() {



}

function countCharacterNum() {

    loadFont( "./static/noto-serif-sc-regular.woff" ).then( response => {

        if ( ! response.success ) {

            console.log( response.error );

            return;

        }

        const font = response.font;

        console.log( font.glyphs.length );

    } );

}

/**
 * （异步）加载字体文件。
 * @param { string } - 字体文件的路径，比如"./font.otf"。
 * @returns { Promise } - Promise代表是否成功加载字体文件，若成功，则返回{success: true, font}对象，否则返回{success: false, error}对象。
 */
function loadFont( path ) {

    return new Promise( resolve => {

        opentype.load( path, ( error, font ) => {

            error ? resolve( { success: false, error } ) : resolve( { success: true, font } );

        } );

    } );

}