/**
 * 提取html文件的标签的内容。
 * @param {string} input - html文件的内容，是一串字符串（该方法不区分html标签的大小写）。
 * @param {Array<string>} [nodes] - 包含零至多个标签名的数组，比如["h1", "p"]。缺省时，将提取所有标签的内容，
 * 否则只提取指定标签的内容，注意：1.不能输入自闭合标签；2.标签名不区分大小写。
 * @returns {string} - html标签的内容。
 */
function parseHtml( input, nodes ) {

    if ( ! nodes ) return core( input );

    if ( ! nodes.length ) return "";

    const regexp = new RegExp( `</?(${ nodes.join( "|" ) })(>|(\\s*>)|(\\s[^>]*>))`, "ig" );
    const tags = input.match( regexp );

    if ( ! tags ) return "";

    let output = "";
    let from_index_in_tags = 0;
    let from_index_in_input = 0;

    while ( from_index_in_tags < tags.length ) {

        const header = tags[ from_index_in_tags ];
        const footer = header.match( /<[a-z][a-z0-9]*/i )[ 0 ].replace( "<", "</" ) + ">";

        const header_index = from_index_in_tags;
        const footer_index = tags.indexOf( footer, from_index_in_tags );

        const from = input.indexOf( header, from_index_in_input );
        const to = input.indexOf( footer, from_index_in_input ) + footer.length;

        output += core( input.slice( from ,to ) );
        from_index_in_tags = footer_index + 1;
        from_index_in_input = to;

    }

    return output;

    function core( input ) {

        const tags = input.match( /<!?\/?[a-z][a-z0-9]*[^>]*>/ig );

        if ( ! tags ) return "";

        let output = "";
        let from_index = 0;

        tags.forEach( tag => {

            const from = input.indexOf( tag, from_index );
            const snippet = input.slice( from_index, from );

            output += snippet;
            from_index = from + tag.length;

        } );

        return output;

    }

}

module.exports = parseHtml;
