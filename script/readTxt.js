const fs = require( "fs" );

const deepTraversal = require( "./deepTraversal" );

const deduplication = require( "./deduplication" );

/**
 * （异步）读取一个txt文件或一个文件夹内所有的txt文件，文件的内容要么是字符串，要么是以逗号分隔的unicode（基于十进制），
 * 该方法会对读取的内容进行去重处理。
 * @param { string } path - 文件或文件夹的路径，比如"./characters.txt"或"./directory"。
 * @param { number } format - 文件的内容的格式，数字1文件的内容是字符串，数字2代表文件的内容是以逗号分隔的unicode（基于十进制）。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。若format为1，则content是字符串，若format为2，则content是unicode数组。
 */
async function readTxt( path, format ) {

    if ( format !== 1 && format !== 2 ) return { success: false, error: new TypeError( "TypeError: The type of the second parameter is wrong." ) };

    const paths = [];

    const is_directory = fs.lstatSync( path ).isDirectory();

    if ( is_directory ) {

        const response = await deepTraversal( path );

        if ( ! response.success ) return { success: false, error: response.error };

        response.files.forEach( file => paths.push( file.path ) );

    } else {

        paths.push( path );

    }

    let content = format === 1 ? "" : [];

    for ( const path of paths ) {

        const response = await coreRead( path, format );

        if ( ! response.success ) return { success: false, error: response.error };

        format === 1

            ? ( content += response.content )

            : content.push( ... response.content );

    }

    content = deduplication( content );

    return { success: true, content };

}

/**
 * （异步）读取一个txt文件，文件的内容要么是字符串，要么是以逗号分隔的unicode（基于十进制），
 * @param { string } path - 文件的路径，比如"./characters.txt"。
 * @param { number } format - 文件的内容的格式，数字1文件的内容是字符串，数字2代表文件的内容是以逗号分隔的unicode（基于十进制）。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。若format为1，则content是字符串，若format为2，则content是unicode数组。
 */
function coreRead( path, format ) {

    return new Promise( resolve => {

        if ( format !== 1 && format !== 2 ) {

            resolve( { success: false, error: new TypeError( "TypeError: The type of the second parameter is wrong." ) } );

            return;

        }

        let data = "";

        const reader = fs.createReadStream( path, "utf8" );

        reader.on( "data", chunk => data += chunk );
        reader.on( "error", error => resolve( { success: false, error } ) );
        reader.on( "end", _ => {

            resolve( ( {

                success: true,

                content: format === 1 ? data : data.split( "," ).map( unicode => + unicode ),

            } ) );

        } );

    } );

}

module.exports = readTxt;
