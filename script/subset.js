const opentype = require( "opentype.js" );

const deduplication = require( "./deduplication" );

/**
 * 根据字符串或unicode数组来子集化字体文件，该方法会对输入内容进行去重处理。
 * @param { string | Array<number> } data - 字符串（如"ABC"）或存储unicode编码的数组（如[65, 66, 67]，采用十进制）。
 * @param { string } path_origin - 原始的字体文件的路径，比如"./origin.otf"。
 * @param { string } path_subset - 生成的字体文件的路径，比如"./sunset.otf"。
 * @returns { Object } - 子集化字体的相关信息，successfulCharacters属性代表成功截取的字符，successfulUnicodes属性代表
 * 成功截取的字符的unicode，failedCharacters属性代表未能截取的字符，failedUnicodes属性代表未能截取的字符的unicode。
 */
async function subset( data, path_origin, path_subset ) {

    /* 字符去重，并生成字符串。 */
    const characters = deduplication( data, 1 );

    /* 异步加载字体文件。 */
    const load_font_response = await loadFont( path_origin );

    if ( ! load_font_response.success ) {

        console.warn( "Font could not be loaded: " + load_font_response.error );

        return;

    }

    const font = load_font_response.font;

    /* 生成子集化字体。 */
    const notdef_glyph = font.glyphs.get( 0 );

    notdef_glyph.name = ".notdef";

    const glyphs = [ notdef_glyph ];

    const response = {            // 子集化字体的相关信息

        successfulCharacters: "", // 成功截取的字符

        successfulUnicodes: [],   // 成功截取的字符的unicode

        failedCharacters: "",     // 未能截取的字符

        failedUnicodes: [],       // 未能截取的字符的unicode

    };

    for ( let character of characters ) {

        const glyph = font.charToGlyph( character );

        response[ glyph.unicode === undefined ? "failedCharacters" : "successfulCharacters" ] += character;
        response[ glyph.unicode === undefined ? "failedUnicodes" : "successfulUnicodes" ].push( character.codePointAt( 0 ) );

        glyph.unicode !== undefined && glyphs.push( glyph );

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

    subset_font.download( path_subset );

    /* 返回子集化字体的相关信息。 */
    return response;

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

module.exports = subset;
