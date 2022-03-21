/**
 * 提取html文本的标签的内容。
 * @param { string } characters - html文本的内容，比如使用read方法读取html文件所得到的字符串，html文本中的标签名既可以是大写
 * 也可以是小写。
 * @param { undefined | Array<string> } [ tagnames = undefined ] - 默认值为undefined，当值为undefined时，该方法会提
 * 取所有标签的内容。当值为[ "h1", "h2", "h3" ]时，该方法会提取所有h1、h2、h3标签的内容，同理类推...注意，1.不能输入自闭合标签，
 * 比如[ "img" ]；2.既可以输入大写的标签，也可以输入小写的标签，比如[ "h1" ]和[ "H1" ]是等价的。
 * @returns { string } - 标签的内容。
 * @bug 当文档中使用转义字符（如&gt;）时，该方法会把它当成字符串来解析，而不是解析转义字符转译后的字符。如果用户使用了iconfont的
 * 转义字符时，又该怎么解析他们呢？？？
 */
function parseHtml( characters, tagnames ) {

    if ( tagnames !== undefined && ! Array.isArray( tagnames ) ) return new TypeError("TypeError: The type of the first parameter is wrong.");

    if ( tagnames === undefined ) return coreParse( characters );

    if ( ! tagnames.length ) return "";

    const regexp = new RegExp( `</?(${ tagnames.join( "|" ) })(>|(\\s*>)|(\\s[^>]*>))`, "ig" );

    const tags = characters.match( regexp );

    if ( ! tags ) return "";

    let content = "";

    let from_index_in_tags = 0;

    let from_index_in_input = 0;

    while ( from_index_in_tags < tags.length ) {

        const header = tags[ from_index_in_tags ];
        const footer = header.match( /<[a-z][a-z0-9]*/i )[ 0 ].replace( "<", "</" ) + ">";

        const header_index = from_index_in_tags;
        const footer_index = tags.indexOf( footer, from_index_in_tags );

        const from = characters.indexOf( header, from_index_in_input );
        const to = characters.indexOf( footer, from_index_in_input ) + footer.length;

        content += coreParse( characters.slice( from ,to ) );
        from_index_in_tags = footer_index + 1;
        from_index_in_input = to;

    }

    return content;

}

function coreParse( characters ) {

    const tags = characters.match( /<!?\/?[a-z][a-z0-9]*[^>]*>/ig );

    if ( ! tags ) return "";

    let content = "";

    let from_index = 0;

    tags.forEach( tag => {

        const from = characters.indexOf( tag, from_index );

        const snippet = characters.slice( from_index, from );

        content += snippet;

        from_index = from + tag.length;

    } );

    return content;

}

module.exports = parseHtml;
