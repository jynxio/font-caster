const fs = require( "fs" );

const deepTraversal = require( "./deepTraversal" );

/**
 * （异步）读取一个txt文件的内容或一个文件夹中所有txt文件的内容，txt文件的内容要么是字符串，
 * 要么是以逗号分隔的十进制的unicode编码，该方法会对输出内容进行去重处理。
 * @param { string } path - 一个txt文件的路径或一个文件夹的路径，程序基于该入参来决定是读取一个文件还是深度遍历一个目录。
 * @param { number } format - txt文件内容的格式，数字1代表字符串，数字2代表unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
async function read( path, format ) {

    const is_directory = fs.lstatSync( path ).isDirectory();



}

/**
 * （异步）读取一个txt文件，txt文件的内容要么是字符串，要么是以逗号分隔的十进制的unicode编码，该方法会对输出内容进行去重处理。
 * @param { string } path - txt文件的路径。
 * @param { number } format - txt文件内容的格式，数字1代表字符串，数字2代表unicode数组。
 * @returns { Promise } - Promise代表是否读取成功，若成功则返回{success: true, content}对象，
 * 否则返回{success: false, error}对象。
 */
async function readTxt( path, format ) {

    

}

module.exports = read;
