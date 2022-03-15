const fs = require( "fs" );

const refineFont = require( "./refineFont" );

const parseHtml = require( "./parseHtml" );

const opentype = require( "opentype.js" );

/* ---------------------------------------------------------------------------- -------------------*/

// test

// const font = opentype.loadSync( "./static/font/full/NotoSansSC-Regular.otf");

// const font_family = font.names.fontFamily.en;
// const font_weight = font.names.fontSubfamily.en;
// const glyph_number = font.numGlyphs;

// const subset_font_name = font_family + "-" + font_weight + "-subset.otf";

// console.log( font.stringToGlyphs( "你我他" ) );
// console.log( font.charToGlyph( "你" ) );
// console.log( font.charToGlyph( "❤️" ) );
// console.log( font.glyphs.get( 7182 ).path );

// test

main();

async function main() {

    const html = await readUtf8File( "./static/html/test.html" );

    const characters = parseHtml( html );
    const length = Array.from( characters ).length;
    const unicodes = new Set();

    for ( let i = 0; i < length; i++ ) {

        const unicode = characters.codePointAt( i );

        unicodes.add( unicode );

    }

    const font = opentype.loadSync( "./static/font/full/NotoSerifSC-Regular.otf");

    const notdef_glyph = font.glyphs.get( 0 );

    notdef_glyph.name = ".notdef";

    const glyphs = [ notdef_glyph ];

    for ( let unicode of unicodes ) {

        const character = String.fromCodePoint( unicode );

        const glyph = font.charToGlyph( character );

        if ( glyph.unicode === undefined ) continue;

        glyphs.push( glyph );

    }

    const subset_font = new opentype.Font( {
        familyName: font.names.fontFamily.en,
        styleName: font.names.fontSubfamily.en,
        unitsPerEm: font.unitsPerEm,
        ascender: font.ascender,
        descender: font.descender,
        designer: font.getEnglishName('designer'),
        designerURL: font.getEnglishName('designerURL'),
        manufacturer: font.getEnglishName('manufacturer'),
        manufacturerURL: font.getEnglishName('manufacturerURL'),
        license: font.getEnglishName('license'),
        licenseURL: font.getEnglishName('licenseURL'),
        version: font.getEnglishName('version'),
        description: font.getEnglishName('description'),
        copyright: "",
        trademark: font.getEnglishName('trademark'),
        glyphs: glyphs
    } );

    subset_font.download( "./static/font/condensed/test.otf" );


    // 写入文件
    // const txt = Array.from( unicodes ).join( "," );

    // const success = await writeUtf8File( "./static/character/character.txt", txt );

    // console.log( success ? "🟢：写入成功" : "🔴：写入失败" );

}

/**
 * 异步读取使用utf-8编码的文件，最后以字符串形式返回该文件的内容。
 * @param {string} path - 待读取的文件的地址，比如"./test.html"。
 * @returns {Promise} - Promise代表字符串形式的文件的内容。
 */
function readUtf8File( path ) {

    return new Promise( resolve => {

        let output = "";

        const reader = fs.createReadStream( path, "utf8" );

        reader.on( "data", chunk => output += chunk );
        reader.on( "end", _ => resolve( output ) );

    } );

}

/**
 * 异步以utf8编码写入一个文件。
 * @param {string} path - 待写入文件的地址，若该文件已存在，则会覆写该文件，若该文件不存在，则会创建一个文件。
 * @param {string} data - 待写入的字符串内容。
 * @returns {Promise} - Promise代表是否写入成功。
 */
function writeUtf8File( path, data ) {

    return new Promise( resolve => {

        fs.writeFile( path, data, "utf8", error => {

            resolve( error ? false : true );

        } );

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
