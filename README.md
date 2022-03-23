# fontfinder
## 简介

简洁的字体子集化工具，通过剔除冗余的字符来缩减字体文件的体积，依赖 Node.js 运行时，基于 [optntype.js](https://github.com/opentypejs/opentype.js)。

<br/><br/>

## 下载

```
npm install --save-prod fontfinder
```

<br/><br/>

## API

- [subset](#subset)：子集化字体文件。
- [read](#read)：读取文本文件。
- [write](#write)：写入文本文件。
- [parseHtml](#parsehtml)：提取HTML文件的内容。
- [convert](#convert)：将字符转换为unicode，或反之。
- [deduplication](#deduplication)：对字符串或unicode数组进行去重。

<br/>

### subset

##### 定义：

（异步）根据字符串或unicode数组来子集化字体文件，该方法会对输入内容进行去重处理。

##### 语法：

```js
subset( data, path_origin, path_subset ).then( _ => {} );
```

##### 入参：

- `data`：`{ string || Array<number> }` - 字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制）。
- `path_origin`：`{ string }` - 原始的字体文件的路径，比如 `"./origin.otf"`，也支持 `ttf`、`woff`。
- `path_subset`：`{ string }` - 生成的字体文件的路径，比如 `"./sunset.otf"`，生成的字体文件的格式必须与生原始的字体文件的格式一致。

##### 返回：

`{ Promise }` - `Promise` 代表是否成功子集化，若失败则返回 `{success: false, error}`，否则返回 `{success: true,information}` 对象。其中 `information` 属性包含 `successfulCharacters`、`successfulUnicodes`、`failedCharacters`、`failedUnicodes`属性，它们分别代表“成功截取的字符”、“成功截取的字符的unicode”、“未能截取的字符”、“未能截取的字符的unicode”，并且子集化成功后会自动下载字体文件。

##### 范例：

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

<br/>

### read

##### 定义：

（异步）读取一个使用utf-8编码的文本文件或一个文件夹内所有的此类文本文件。

> 注意：在 MacOS 下，该方法会误读 `.DS_Store` 文件，详见 [BUG: The read API will read the ".DS_Store" file. #1](https://github.com/1337816495/fontcaster/issues/1)。

##### 语法：

```js
read( path, is_unicode ).then( _ => {} );
```

##### 入参：

- `path`：`{ string }` - 文件或文件夹的路径，比如 `"./characters.txt"或"./pages"`。
- `is_unicode`：`{ boolean }` - （可选）默认值为 `false`，当值为 `false` 时，文本的内容是什么，读取的结果就是什么。当值为 `true` 时，程序会认为文本的内容是以逗号分隔的unicode（基于十进制），读取的结果则是unicode数组。

##### 返回：

`{ Promise }` - `Promise` 代表是否读取成功，若失败则返回 `{success: false, error}` 对象，否则返回 `{success: true, files}` 对象，其中 `files` 属性是拥有至少一个 `{name, type, path, content}` 对象的数组。

##### 范例：

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

<br/>

### write

##### 定义：

（异步）将字符串或unicode数组存储为txt文本。

##### 语法：

```js
write( data, path ).then( _ => {} );
```

##### 入参：

- `data`：`{ string | Array<number> }` - 字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制），若传入的是字符串，则txt文件将存储字符串，若传入的是unicode数组，则txt文件将存储以逗号分隔的unicode（基于十进制）。
- `path`：`{ string }` - txt文件的地址，比如 `"./characters.txt"`。

##### 返回：

`{ Promise }` - `Promise` 代表是否写入成功，若成功则返回 `{success: true}` 对象，否则返回 `{success: false, error}` 对象。

##### 范例：

```js
write( "AABC", "./characters.txt" ).then( response => {
    
    if ( response.success ) return; // The content of characters.txt is "AABC".
    
    console.error( response.error );
    
} );

/* or */

write( [ 65, 65, 66, 67 ], "./characters.txt" ).then( response => {
    
    if ( response.success ) return; // The content of characters.txt is "65,65,66,67".
    
    console.error( response.error );
    
} );
```

<br/>

### parseHtml

##### 定义：

提取html文本的标签的内容。

> 注意：该方法会将转义字符（比如 `&gt;` ）当成字符串来处理，详见 [BUG: Cannot handle escape characters. #2](https://github.com/1337816495/fontcaster/issues/2)，该缺陷将在未来得到修复。

```js
parseHtml( characters, tagnames );
```



##### 入参：

- `characters`：`{ string }` - html文本的内容，比如使用read方法读取html文件所得到的字符串，html文本中的标签名既可以是大写也可以是小写。
- `tagnames`：`{ undefined | Array<string> }` - （可选）默认值为 `undefined`，当值为 `undefined` 时，该方法会提取所有标签的内容。当值为 `[ "h1", "h2", "h3" ]` 时，该方法会提取所有 `h1`、`h2`、`h3` 标签的内容，同理类推...注意，1.不能输入自闭合标签，比如 `[ "img" ]`；2.既可以输入大写的标签，也可以输入小写的标签，比如 `[ "h1" ]` 和 `[ "H1" ]` 是等价的。

##### 返回：

`{ string }` - 标签的内容。

##### 范例：

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

<br/>

### convert

##### 定义：

将字符串转换为unicode数组，或者将unicode数组转换为字符串。

##### 语法：

```js
convert( data );
```

##### 入参：

- `data`：`{ string | Array<number> }` - 字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制）。

##### 返回：

`{ string | Array<number> }` - 若入参是字符串，则输出unicode数组，若入参是unicode数组，则输出字符串。

##### 范例：

```js
convert( "ABC" );          // output: [ 65, 66, 67 ]
convert( [ 65, 66, 67 ] ); // output: "ABC"
```

<br/>

### deduplication

**定义：**

对字符串或unicode数组进行去重。

**语法：**

```js
deduplication( data )
```

**入参：**

- `data`：`{ string | Array<number> }` - 字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，采用十进制）。

**返回：**

`{ string | Array<number> }` - 若入参是字符串，则输出去重后的unicode数组，若入参是unicode数组，则输出去重后的字符串。

**范例：**

```js
deduplication( "AABC" );             // output: "ABC"
deduplication( [ 65, 65, 66, 67 ] ); // output: [ 65, 66, 67 ]
```

<br/><br/>

## 许可

本项目遵循 [MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE) 。

<br/><br/>

## 版本控制

本项目遵循 [语义化版本控制](https://semver.org/lang/zh-CN/) 。
