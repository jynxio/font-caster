# font-subset
# 简介

简洁与静态的字体子集化工具，旨在通过减少字体文件中的字符数量来缩减字体文件的体积，该项目基于 [optntype.js](https://github.com/opentypejs/opentype.js) 。

> 注意：该项目暂未发布至 NPM，但其 API 均可在 Node 运行时中稳定使用。



# 进度

版本号：小于 `0.1.0`。

未完成：

- [ ] 修复：`read` 与 `parseHtml` 无法处理转义字符。
- [ ] 修复：在 MacOS 下，`read` 方法会读取到 `.DS_Store` 文件。
- [x] 新增：支持处理  `otf`、`ttf`、`woff` 格式的字体。
- [ ] 新增：支持将字体格式转换为 `otf`、`ttf`、`woff`、`woff2`。
- [ ] 新增：支持浏览器运行时。

> 注意：不要对 `woff2` 格式的字体启用 gzip。



# API

## 目录

- **subset：**（异步）根据字符串或unicode数组来子集化字体文件，该方法会对输入内容进行去重处理。
- **read：**（异步）读取一个使用utf-8编码的文本文件或一个文件夹内所有的此类文本文件。
- **write：**（异步）将字符串或unicode数组存储为txt文本，该方法会对输入内容进行去重处理。
- **parseHtml：**提取html文本的标签的内容。
- **convert：**将字符串转换为unicode数组，或者将unicode数组转换为字符串。

## subset

### 定义

（异步）根据字符串或unicode数组来子集化字体文件，该方法会对输入内容进行去重处理。

### 语法

```js
subset( data, path_origin, path_subset );
```

### 入参

- **`data`**

  `{ string || Array<number> }`，字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制）。

- `path_origin`

  `{ string }`，原始的字体文件的路径，比如 `"./origin.otf"`，也支持 `ttf`、`woff`。

- `path_subset`

  `{ string }`，生成的字体文件的路径，比如 `"./sunset.otf"`，生成的字体文件的格式必须与生原始的字体文件的格式一致。

### 返回

- `{ Promise }`，`Promise` 代表是否成功子集化，若失败则返回 `{success: false, error}`，否则返回 `{success: true,information}` 对象。其中 `information` 属性包含 `successfulCharacters`、`successfulUnicodes`、`failedCharacters`、`failedUnicodes`属性，它们分别代表“成功截取的字符”、“成功截取的字符的unicode”、“未能截取的字符”、“未能截取的字符的unicode”，并且子集化成功后会自动下载字体文件。

### 范例

```js
subset( data, path_origin, path_subset ).then( response => {
    
    if ( ! response.success ) {
        
        console.error( response.error );
        
        return;
        
    }
    
    console.log( response.information.successfulCharacters );
    console.log( response.information.successfulUnicodes );
    console.log( response.information.failedCharacters );
    console.log( response.information.failedUnicodes );
    
} );
```

## read

### 定义

（异步）读取一个使用utf-8编码的文本文件或一个文件夹内所有的此类文本文件。

> **BUG：**在 MacOS 下，如果目标文件夹内存在 `.DS_Store` 文件，则读取目录中的所有使用 `utf-8` 编码的文件时，该方法也会读取到 `.DS_Store` 文件。你可以通过 `name` 属性来判断程序是否误读到了 `.DS_Store` 文件，因为 `.DS_Store` 文件的 `name` 属性的值为 `".DS_Store"` 。

### 入参

1. `path`：`{ string }` - 文件或文件夹的路径，比如 `"./characters.txt"或"./pages"`。
2. `is_unicode`：`{ boolean }` - （可选）默认值为 `false`，当值为 `false` 时，文本的内容是什么，读取的结果就是什么。当值为 `true` 时，程序会认为文本的内容是以逗号分隔的unicode（基于十进制），读取的结果则是unicode数组。

### 返回

`{ Promise }` - `Promise` 代表是否读取成功，若失败则返回 `{success: false, error}` 对象，否则返回 `{success: true, files}` 对象，其中 `files` 属性是拥有至少一个 `{name, path, content}` 对象的数组。

### 范例

```js
read( "./pages" ).then( response => {
    
    if ( ! response.success ) {
        
        console.error( response.error );

        return;

    }
    
    for ( const file of files ) {
        
        console.log( file.name );
        console.log( file.path );
        console.log( file.content );
        
    }
    
} );
```

## write

### 定义

（异步）将字符串或unicode数组存储为txt文本，该方法会对输入内容进行去重处理。

### 入参

1. `data`：`{ string | Array<number> }` - 字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制），若传入的是字符串，则txt文件将存储字符串，若传入的是unicode数组，则txt文件将存储以逗号分隔的unicode（基于十进制）。
2. `path`：`{ string }` - txt文件的地址，比如 `"./characters.txt"`。

### 返回

`{ Promise }` - `Promise` 代表是否写入成功，若成功则返回 `{success: true}` 对象，否则返回 `{success: false, error}` 对象。

### 范例

```js
write( "abcd", "./characters.txt" ).then( response => {
    
    if ( response.success ) return;
    
    console.error( response.error );
    
    return;
    
} );

/* or... */

write( [ 65, 66, 67 ], "./characters.txt" ).then( response => { /* same as above */ } );
```

## parseHtml

### 定义

提取html文本的标签的内容。

> **BUG：**当文档中使用转义字符（如 `&gt;` ）时，该方法会把它当成字符串来解析，而不是解析转义字符转译后的字符。

### 入参

1. `characters`：`{ string }` - html文本的内容，比如使用read方法读取html文件所得到的字符串，html文本中的标签名既可以是大写也可以是小写。
2. `tagnames`：`{ undefined | Array<string> }` - （可选）默认值为 `undefined`，当值为 `undefined` 时，该方法会提取所有标签的内容。当值为 `[ "h1", "h2", "h3" ]` 时，该方法会提取所有 `h1`、`h2`、`h3` 标签的内容，同理类推...注意，1.不能输入自闭合标签，比如 `[ "img" ]`；2.既可以输入大写的标签，也可以输入小写的标签，比如 `[ "h1" ]` 和 `[ "H1" ]` 是等价的。

### 返回

`{ string }` - 标签的内容。

### 范例

```js
read( "./index.html" ).then( response => {
    
    if ( ! response.success ) {
        
        console.error( response.error );
        
        return;
        
    }
    
    const h1_content_array = [];
    
    for ( const file of files ) {
        
        const h1_content = parseHtml( file.content, [ "h1" ] );
        
        h1_content_array.push( h1_content );
        
    }
    
} );
```

## convert

### 定义

将字符串转换为unicode数组，或者将unicode数组转换为字符串。

### 入参

1. `data`：`{ string | Array<number> }` - 字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制）。

### 返回

`{ string | Array<number> }` - 若入参是字符串，则输出unicode数组，若入参是unicode数组，则输出字符串。

### 范例

```js
const characters = "ABC";
const unicodes = [ 65, 66, 67 ];

convert( characters ); // output: [ 65, 66, 67 ]
convert( unicodes );   // output: "ABC"
```



# 关于格式转换

该项目暂不支持转换字体的格式。

对于汉字字体文件而言，将 `otf` 转换为 `ttf` 是刚需。然而目前 JS 世界中缺少将 `otf` 转换为 `ttf` 开源库，并且几乎所有的在线转换工具都无法将 `otf` 文件正确的转换为 `ttf` 文件，比如 [fontsquirrel](https://www.fontsquirrel.com/)、[Convertio](https://convertio.co) 等等。

> 如果你愿意向我分享任何有关线索，请通过 issue 告知我吧！🙏



# 关于汉字字体下载

- [Google Fonts](https://fonts.google.com/) 提供 Noto Sans 和 Noto Serif 的下载服务（免费 & 开源），缺点是仅提供 `otf` 格式，优点是字符齐全，比如 Noto Serif SC 拥有 30884 个有效字符。
- [google-webfonts-helper](https://github.com/majodev/google-webfonts-helper) 也提供 Noto Sans 和 Noto Serif 的下载服务（免费 & 开源），缺点是字符较少，比如 Noto Serif SC 拥有 8115 个有效字符，优点是提供 `ttf`、`woff`、`woff2`格式。



# 关于字体分析

- [FontDrop!](https://fontdrop.info/) 是一个在线的字体分析站点，它可以显示字符数、字形等等，缺点是无法处理字符数量庞大的字体文件。
- [opentype.js](https://opentype.js.org/index.html) 是一个在线的字体分析站点，它可以显示字形，并可以处理字符数量庞大的字体文件。



# 许可

本项目遵循 [MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE) 。



# 版本控制

本项目遵循 [语义化版本控制](https://semver.org/lang/zh-CN/) 。
