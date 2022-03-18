const fs = require( "fs" );

// const refineFont = require( "./refineFont" );

const parseHtml = require( "./parseHtml" );

const opentype = require( "opentype.js" );

const write = require( "./write" );

/* ---------------------------------------------------------------------------- -------------------*/

// test

const data_1 = "ABCBC𐺀𐺀";
const data_2 = [ 65, 66, 67, 65, 66, 67, 69248 ];

write( data_2, "./static/character/character.txt" ).then( response => {

    if ( ! response.success ) return;

    console.log( response );

} );

// test








// main();

async function main() {

    /* 获取html文件 */
    const files = await deepTraversalDirectory( "./page" );

    const html_files = [];

    for ( let file of files ) {

        const type = parseFileType( file.name );

        if ( type !== "html" ) continue;

        html_files.push( file );

    }

    /*  */
    const unicodes = new Set();

    for ( let file of html_files ) {

        const content = await readUtf8File( file.path );

        const characters = parseHtml( content );

        const length = Array.from( characters ).length; //  String.prototype.length无法准确计算字符的长度，这是为了向后兼容而故意设计的。

        for ( let i = 0; i < length; i++ ) {

            const unicode = characters.codePointAt( i );

            unicodes.add( unicode );

        }

    }

    const font = opentype.loadSync( "./static/font/full/NotoSerifSC-Regular.otf" );

    const notdef_glyph = font.glyphs.get( 0 );

    notdef_glyph.name = ".notdef";

    const glyphs = [ notdef_glyph ];

    for ( let unicode of unicodes ) {

        const character = String.fromCodePoint( unicode );

        const glyph = font.charToGlyph( character );

        if ( glyph.unicode === undefined ) continue;

        glyphs.push( glyph );

    }

    const subset_font = new opentype.Font( { // TODO 这里👇要优化一下。
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

    console.log( "🟢" );

    return;

    // 写入文件
    // const txt = Array.from( unicodes ).join( "," );

    // const success = await writeUtf8File( "./static/character/character.txt", txt );

    // console.log( success ? "🟢：写入成功" : "🔴：写入失败" );

}

/**
 * 
 * @param {Object} options -
 * @param {string} options.inputFontPath
 * @param {string} options.ouputFontPath
 * @param {string} options.characters
 */
async function subsetFont( options ) {

    // TODO

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

/**
 * （异步）深度遍历目录，然后返回其内所有文件的信息（文件名与地址）。
 * @param {string} path - 目录的地址，比如"./page"。
 * @returns {Promise} - Promise代表一个包含文件信息的数据。
 */
async function deepTraversalDirectory( path ) {

    const files = [];

    const dirents = await traversalDirectory( path );

    if ( ! dirents ) return files;

    for ( let dirent of dirents ) {

        const name = dirent.name;
        const adress = path + "/" + name;

        if ( dirent.isFile() ) {

            files.push( { name, path: adress } );

        } else if ( dirent.isDirectory() ) {

            files.push( ... await deepTraversalDirectory( adress ) );

        }

    }

    return files;

    /**
     * （异步）遍历目录，然后返回其内所有文件的信息（fs.Dirent对象）。
     * @param {string} path - 目录的地址，比如"./page"。
     * @returns {Promise} - Promise代表是否遍历成功，若成功，则返回包含fs.Dirent对象的数据，否则返回false。
     */
    function traversalDirectory( path ) {

        return new Promise( resolve => {

            fs.readdir( path, { encoding: "utf8", withFileTypes: true }, ( error, dirents ) => {

                if ( error ) {

                    console.warn( "读取目录时发生错误：" + error );

                    resolve( false );

                    return;

                }

                resolve( dirents );

            } )

        } );

    }

}

/**
 * 根据文件名解析文件的类型。
 * @param {string} name - 文件名，比如"a.txt"。
 * @returns {string} - 文件类型，比如对于html文件，返回结果是"html"。
 */
function parseFileType( name ) {

    const index = name.lastIndexOf( "." );

    if ( index === -1 ) return "";

    return name.slice( index + 1 );

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
