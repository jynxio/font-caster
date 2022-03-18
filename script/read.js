const fs = require( "fs" );

const deepTraversal = require( "./deepTraversal" );

const deduplication = require( "./deduplication" );

/**
 * （异步）读取一个使用utf-8编码的文本文件或一个文件夹内所有的此类文本文件，该方法会对读取的内容进行去重处理。
 * @param { string } path - 文件或文件夹的路径，比如"./characters.txt"或"./directory"。
 * @param { boolean } [ isUnicode = false ] - 默认值为false，当值为false时，文本的内容是什么，读取的结果就是什么。
 * 当值为true时，程序会认为文本的内容是以逗号分隔的unicode（基于十进制），读取的结果则是unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
async function read( path, isUnicode = false ) {

    const paths = [];

    const is_directory = fs.lstatSync( path ).isDirectory();

    if ( is_directory ) {

        const response = await deepTraversal( path );

        if ( ! response.success ) return { success: false, error: response.error };

        response.files.forEach( file => paths.push( file.path ) );

    } else {

        paths.push( path );

    }


    let content = isUnicode ? [] : "";

    for ( const path of paths ) {

        const response = await coreRead( path, isUnicode );

        if ( ! response.success ) return { success: false, error: response.error };

        isUnicode ? content.push( ... response.content ) : ( content += response.content );

    }

    content = deduplication( content );

    return { success: true, content };

}

/**
 * （异步）读取一个使用utf-8编码的文本文件。
 * @param { string } path - 文本文件的路径，比如"./characters.txt"。
 * @param { boolean } [ isUnicode = false ] - 默认值为false，当值为false时，文本的内容是什么，读取的结果就是什么。
 * 当值为true时，程序会认为文本的内容是以逗号分隔的unicode（基于十进制），读取的结果则是unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
function coreRead( path, isUnicode = false ) {

    return new Promise( resolve => {

        let data = "";

        const reader = fs.createReadStream( path, "utf8" );

        reader.on( "data", chunk => data += chunk );
        reader.on( "error", error => resolve( { success: false, error } ) );
        reader.on( "end", _ => {

            resolve( ( {

                success: true,

                content: isUnicode ? data.split( "," ).map( unicode => + unicode ) : data,

            } ) );

        } );

    } );

}

module.exports = read;
