const fs = require( "fs" );

const deepTraversal = require( "./deepTraversal" );

const deduplication = require( "./deduplication" );
// TODO 验证该方法
/**
 * （异步）读取一个txt文件的内容或一个文件夹中所有txt文件的内容，txt文件的内容要么是字符串，
 * 要么是以逗号分隔的十进制的unicode编码，该方法会对输出内容进行去重处理。
 * @param { string } path - 一个txt文件的路径或一个文件夹的路径，程序基于该入参来决定是读取一个文件还是深度遍历一个目录，
 * 比如"./characters.txt"，或"./directory"。
 * @param { number } format - txt文件内容的格式，数字1代表字符串，数字2代表unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
async function read( path, format ) {

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

        const response = readTxt( path, format );

        if ( ! response.success ) return { success: false, error: response.error };

        if ( format === 1 ) content += response.content;
        else content.concat( response.content );

    }

    content = deduplication( content, format );

    return { success: true, content };

}

/**
 * （异步）读取一个txt文件，txt文件的内容要么是字符串，要么是以逗号分隔的十进制的unicode编码，
 * @param { string } path - txt文件的路径，比如"./characters.txt"。
 * @param { number } format - txt文件内容的格式，数字1代表字符串，数字2代表unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
async function readTxt( path, format ) {

    return new Promise( resolve => {

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

module.exports = read;
