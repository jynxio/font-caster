/**
 * 将字符串转换为unicode数组，或者将unicode数组转换为字符串。
 * @param { string | Array<number> } data - 字符串（如"ABC"）或存储unicode编码的数组（如[65, 66, 67]，采用十进制）。
 * @returns { string | Array<number> } - 若入参是字符串，则输出unicode数组，若入参是unicode数组，则输出字符串。
 */
function convert( data ) {

    if ( typeof( data ) === "string" ) return convertCharactersToUnicodes( data );

    if ( Array.isArray( data ) ) return convertUnicodesToCharacters( data );

    return;

}

/**
 * 将字符串转换为unicode数组。
 * @param { string } characters - 字符串，比如"ABC"。
 * @returns { Array<number> } - 存储unicode编码的数组，比如[65, 66, 67]（采用十进制）。
 */
function convertCharactersToUnicodes( characters ) {

    return Array.from( characters ).map( character => character.codePointAt( 0 ) );

}

/**
 * 将unicode数组转换为字符串。
 * @param { Array<number> } unicodes 存储unicode编码的数组，比如[65, 66, 67]（采用十进制）。
 * @returns { string } - 字符串，比如"ABC"。
 */
function convertUnicodesToCharacters( unicodes ) {

    return (

        unicodes.reduce( ( previous_value, current_value ) => {

            return previous_value + String.fromCodePoint( current_value );

        }, "" )

    );

}

module.exports = convert;
