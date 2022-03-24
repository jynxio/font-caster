const convert = require( "./convert" );

/**
 * 对字符串或unicode数组进行去重。
 * @param { string | Array<number> } data - 字符串（如"ABC"）或存储unicode编码的数组（如[65, 66, 67]，采用十进制）。
 * @returns { string | Array<number> } - 若入参是unicode数组，则输出去重后的unicode数组，若入参是字符串，则输出去重后的字符串。
 */
function deduplication( data ) {

    if ( typeof( data ) === "string" ) {

        return convert( Array.from( new Set( convert( data ) ) ) );

    } else if ( Array.isArray( data ) ) {

        return Array.from( new Set( data ) );

    }

    return;

}

module.exports = deduplication;
