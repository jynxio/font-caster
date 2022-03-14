const Fontmin = require( "fontmin" );

/**
 * 简化字体文件，使其只包含characters中的字符。
 * @param {string} characters - 字符集，比如"你我他"。
 * @param {string} font_path - ttf字体文件的路径，
 * 比如"./static/font/full/font.ttf"。
 * @param {string} file_path - 过滤后的字体文件夹的路径，生成的字体文件将会存储在该文件夹中，
 * 比如"/static/font/condensed"。
 * @returns {Promise} - Promise代表是否执行成功。
 */
function refineFont( characters, path_1, path_2  ) {

    return new Promise( ( resolve, reject ) => {

        const fontmin = new Fontmin()
            .src( path_1 )
            .use( Fontmin.glyph( { text: characters } ) )
            .use( Fontmin.ttf2woff2() )
            .dest( path_2 );

            fontmin.run( ( error, files, stream ) => {

                if ( error ) reject( error );

                resolve( true );

            } );

    } );

}

module.exports = refineFont;
