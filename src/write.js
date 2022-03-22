const fs = require( "fs" );

/**
 * （异步）将字符串或unicode数组存储为txt文件，该方法会对输入内容进行去重处理。
 * @param { string | Array<number> } data - 字符串（如"ABC"）或存储unicode编码的数组（如[65, 66, 67]，采用十进制），若传入的是字符串，
 * 则txt文件将存储字符串，若传入的是unicode数组，则txt文件将存储以逗号分隔的unicode（基于十进制）。
 * @param { string } path - txt文件的地址，比如"./character-set.txt"。
 * @returns { Promise } - Promise代表是否写入成功，若成功则返回{success: true}对象，否则返回{success: false, error}对象。
 */
function write( data, path ) {

    return new Promise( resolve => {

        let characters;

        if ( typeof( data ) === "string" ) {

            characters = data;

        } else if ( Array.isArray( data ) ) {

            characters = data.join( "," );

        } else {

            return { success: false, error: new TypeError("TypeError: The type of the first parameter is wrong.") };

        }

        fs.writeFile( path, characters, "utf8", error => {

            error ? resolve( { success: false, error } ) : resolve( { success: true } );

        } );

    } );

}

module.exports = write;
