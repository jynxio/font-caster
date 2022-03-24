const fs = require( "fs" );

const pathNodejs = require( "path" );

const deepTraversal = require( "./deepTraversal" );

/**
 * （异步）读取一个使用utf-8编码的文本文件或一个文件夹内所有的此类文本文件/注意。
 * @param { string } path - 文件或文件夹的路径，比如"./characters.txt"或"./directory"。
 * @param { boolean } [ is_unicode = false ] - 默认值为false，当值为false时，文本的内容是什么，读取的结果就是什么。
 * 当值为true时，程序会认为文本的内容是以逗号分隔的unicode（基于十进制），读取的结果则是unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若失败则返回{success: false, error}对象，否则返回
 * {success: true, files}对象，其中files属性是拥有至少一个{name, type, path, content}对象的数组。
 * @bug 在MacOS下，如果目录中存在.DS_Store文件，则该方法也会读取到该文件。
 */
async function read( path, is_unicode = false ) {

    const files = [];

    const is_directory = fs.lstatSync( path ).isDirectory();

    if ( is_directory ) {

        const response = await deepTraversal( path );

        if ( ! response.success ) return { success: false, error: response.error };

        response.files.forEach( file => {

            const filename = file.name;
            const filetype = pathNodejs.extname( filename ).slice( 1 );
            const filepath = file.path;

            files.push( { name: filename, type: filetype, path: filepath } );

        } );

    } else {

        const filename = pathNodejs.basename( path );
        const filetype = pathNodejs.extname( filename ).slice( 1 );
        const filepath = path;

        files.push( { name: filename, type: filetype, path: filepath } );

    }

    for ( const file of files ) {

        const response = await coreRead( file.path, is_unicode );

        if ( ! response.success ) return { success: false, error: response.error };

        file.content = response.content;

    }

    return { success: true, files };

}

/**
 * （异步）读取一个使用utf-8编码的文本文件。
 * @param { string } path - 文本文件的路径，比如"./characters.txt"。
 * @param { boolean } [ is_unicode = false ] - 默认值为false，当值为false时，文本的内容是什么，读取的结果就是什么。
 * 当值为true时，程序会认为文本的内容是以逗号分隔的unicode（基于十进制），读取的结果则是unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
function coreRead( path, is_unicode = false ) {

    return new Promise( resolve => {

        let data = "";

        const reader = fs.createReadStream( path, "utf8" );

        reader.on( "data", chunk => data += chunk );
        reader.on( "error", error => resolve( { success: false, error } ) );
        reader.on( "end", _ => {

            if ( ! is_unicode ) {

                resolve( { success: true, content: data } );

                return;

            }

            const content = data === "" ? [] : data.split( "," ).map( unicode => + unicode );

            resolve( { success: true, content } );

        } );

    } );

}

module.exports = read;
