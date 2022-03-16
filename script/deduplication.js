/**
 * （内部方法）对unicode数组或字符串进行去重。
 * @param { string | Array<number> } data - 字符串（如"ABC"）或存储unicode编码的数组（如[65, 66, 67]，采用十进制）。
 * @param { number } format - 输出值的格式，数字1代表字符串，数字2代表unicode数组。
 */
function deduplication( data, format ) {

    const unicodes = new Set();

    for ( let item of data ) {

        unicodes.add( typeof data === "number" ? item : item.codePointAt( 0 ) );

    }

    if ( format === 2 ) return Array.from( unicodes );

    return Array.from( unicodes ).reduce( ( previous_value, current_value ) => {

        return previous_value + String.fromCodePoint( current_value );

    }, "" );

}

module.exports = deduplication;
