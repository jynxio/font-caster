const fs = require( "fs" );

/**
 * （异步，内部方法）深度遍历一个目录，然后返回其内所有文件的信息，包括文件名与文件地址。
 * @param { string } path - 目录的地址，比如"./page"。
 * @returns { Promise } - Promise代表是否遍历成功，若成功则返回{success: true, files}对象，否则返回{success: false, error}对象，
 * 其中files属性是包含{name, path}对象的数组，name代表文件全名，path代表文件地址。
 */
async function deepTraversal( path ) {

    const traversal_response = await Traversal( path );

    if ( ! traversal_response.success ) return traversal_response;

    const files = [];

    const dirents = traversal_response.dirents;

    for ( let dirent of dirents ) {

        const name = dirent.name;
        const adress = path + "/" + name;

        if ( dirent.isFile() ) {

            files.push( { name, path: adress } );

        } else if ( dirent.isDirectory() ) {

            const next = await deepTraversal( adress );

            if ( ! next.success ) return { success: false, error: next.error };

            files.push( ... next.files );

        }

    }

    return { success: true, files };

    /**
     * （异步）遍历一个目录，然后返回其内所有文件的信息（fs.Dirent对象）。
     * @param { string } path - 目录的地址，比如"./page"。
     * @returns { Promise } - Promise代表是否遍历成功，若成功，则返回{success: true, dirents}对象，否则返回{success: false, error}对象，
     * 其中dirents属性是包含fs.Dirent对象的数组。
     */
    function Traversal( path ) {

        return new Promise( resolve => {

            fs.readdir( path, { encoding: "utf8", withFileTypes: true }, ( error, dirents ) => {

                error ? resolve( { success: false, error } ) : resolve( { success: true, dirents } );

            } )

        } );

    }

}

module.exports = deepTraversal;
