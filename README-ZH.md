# font-caster

[English](https://github.com/jynxio/font-caster/blob/main/README.md) | [中文简体](https://github.com/jynxio/font-caster/blob/main/README-ZH.md)

极简的字体子集化库，通过剔除冗余的字符来缩减字体文件的体积，该库依赖于 Node.js 运行时。
> 🟢 状态：活跃的

<br/>

# 下载

```
npm install font-caster
```

<br/>

# 快速开始

本节阐述如何一次性的针对多个 html 文件来进行字体子集化，步骤如下：

1. 正式开始之前，我们先假设工作区的目录结构如下：

   ```
   |- page
     |- chapter-1
       |- section-1.html
       |- section-2.html
       |- ...
       |- section-n.html
     |- chapter-2
       |- section-1.html
       |- section-2.html
       |- ...
       |- section-n.html
   |- font.ttf
   |- subset.js
   ```

   `page` 是一个包含多个 html 文件的文件夹。

   `font.ttf` 是原始的字体文件。

   `subset.js` 是执行字体子集化的脚本，它的任务是一次性的针对 `page` 内的所有 html 文件来进行字体子集化。

2. 然后，在 `subset.js` 中导入 `font-caster` ：

   ```js
   const fc = require( "font-caster" );
   ```

3. 然后，提前创建一个用来保存所有 html 文本的内容的变量：

   ```js
   let characters = "";
   ```

4. 然后，读取所有的 html 文本（step 1），并提取出所有标签的内容（step 2），最后将所有内容累加到的 `characters` 变量中（step 3）：

   ```js
   const read_response = await fc.read( "./page" );  // step 1
   
   for ( file of read_response.files ) {
       
       const content = fc.parseHtml( file.content ); // step 2
       
       characters += content;                        // step 3
       
   }
   ```

5. 最后，生成子集化的字体文件：

   ```js
   const subset_response = await fc.subset( characters, "./font.ttf", "./subset-font.ttf" );
   ```

6. 现在，我们的工作区的目录结构如下：

   ```
     |- page
     |- font.tff
   + |- subset-font.ttf
     |- subset.js
   ```

<br/>

# API

| name                            | description                           |
| ------------------------------- | ------------------------------------- |
| [subset](#subset)               | 子集化字体文件。                      |
| [parseHtml](#parseHtml)         | 提取 html 文本的指定的标签的内容。    |
| [read](#read)                   | 读取文件。                            |
| [write](#write)                 | 写入文件。                            |
| [convert](#convert)             | 将字符串转换为 unicode 数组，或反之。 |
| [deduplication](#deduplication) | 对字符串或 unicode 数组进行去重。     |

<br/>

### subset

（异步）根据字符串或 unicode 数组来子集化字体文件，该方法会对输入内容进行去重处理。

**语法**

```js
subset( data, origin_path, subset_path ).then( _ => _ );
```

**参数**

- `data`

  `{ string || Array<number> }`

  字符串（如 `"ABC"`）或存储 unicode 编码的数组，比如 `[65, 66, 67]`（基于十进制）。

- `origin_path`

  `{ string }`

  原始的字体文件的路径，比如 `"./origin.otf"`，也支持 `ttf`、`woff`。

- `subset_path`

  `{ string }`

  生成的字体文件的路径，比如 `"./sunset.otf"`，生成的字体文件的格式必须与生原始的字体文件的格式一致。

**返回**

`{ Promise }`

 `Promise` 代表是否成功子集化，若失败，则返回 `{success: false, error}` 对象。若成功，则返回 `{success: true, information}` 对象，并自动生成子集化的字体文件。

其中 `information` 包含 `successfulCharacters`、`successfulUnicodes`、`failedCharacters`、`failedUnicodes`属性，它们分别代表“成功截取的字符”、“成功截取的字符的unicode”、“未能截取的字符”、“未能截取的字符的 unicode”。

**范例**

```js
subset( "123", "./origin.ttf", "./subset.ttf" ).then( response => {
    
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

### parseHtml

提取 html 文本的指定的标签的内容。

该方法暂时无法处理转义字符，比如它会把 `&gt;` 当成字符 `&`、`g`、`t`、`;`来处理，该缺陷已列入工作计划。

**语法**

```js
parseHtml( characters, tagnames );
```

**参数**

- `characters`

  `{ string }` 

  html 文本的内容，比如使用 `read` 读取 html 文件所得到的字符串。

- `tagnames`

  `{ undefined | Array<string> }`

  （可选）默认值为 `undefined`。当值为 `undefined` 时，该方法会提取所有标签的内容。当值为 `[ "h1", "h2" ]` 时，该方法只会提取所有 `h1`、`h2` 标签的内容，同理类推其他标签。

  注意：1.不能输入自闭合标签，比如 `[ "img" ]`；2.不区分标签名的大小写。

**返回**

`{ string }`

标签的内容。

**范例**

```js
read( "./index.html" ).then( response => {
    
    if ( ! response.success ) {
        
        console.error( response.error );
        
        return;
        
    }
    
    const h1_contents = [];
    
    for ( const file of files ) {
        
        const h1_content = parseHtml( file.content, [ "h1" ] );
        
        h1_contents.push( h1_content );
        
    }
    
} );
```

<br/>

#### read

（异步）读取一个基于 utf-8 编码的文本文件或一个文件夹内的所有的此类文件。

对于 MacOS，该方法在处理文件夹时会误读 `.DS_Store`，你可以通过 `name` 和 `type` 属性来辨认和过滤它。

**语法**

```js
read( path, is_unicode ).then( _ => _ );
```

**参数**

- `path`

  `{ string }`

  文件或文件夹的路径，比如 `"./index.html"或"./pages"`。

- `is_unicode`

  `{ boolean }` 

  （可选）默认值为 `false`。当值为 `false` 时，返回值和文本的内容一模一样。当值为 `true` 时，返回值是基于十进制的 unicode 数组（此时该 API 会认定文本的内容是以逗号分隔的 unicode，比如 `"64,65,66"`，同样它也基于十进制）。

**返回**

`{ Promise }`

`Promise` 代表是否读取成功，若失败，则返回 `{success: false, error}` 对象。若成功，返回 `{success: true, files}` 对象，其中 `files` 是拥有至少一个 `{name, type, path, content}` 对象的数组。

**范例**

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

（异步）将字符串或 unicode 数组存储为文本文件。

**语法**

```js
write( data, path ).then( _ => _ );
```

**参数**

- `data`

  `{ string | Array<number> }`

  字符串（如 `"ABC"`）或存储unicode编码的数组（如 `[65, 66, 67]`，基于十进制），若传入的是字符串，则文本将存储字符串，若传入的是 unicode 数组，则文本将存储以逗号分隔的unicode，比如 `65,66,67`（基于十进制）。

- `path`

  `{ string }` 

  文本文件的路径，比如 `"./characters.txt"`。

**返回**

`{ Promise }`

 `Promise` 代表是否写入成功，若成功，则返回 `{success: true}` 对象。若失败，则返回 `{success: false, error}` 对象。

**范例**

如果第一个参数的值是字符串。

```js
write( "AABC", "./characters.txt" ).then( response => {
    
    if ( response.success ) return; // The content of characters.txt is "AABC".
    
    console.error( response.error );
    
} );
```

如果第一个参数的值是 unicode 数组。

```js
write( [ 65, 65, 66, 67 ], "./characters.txt" ).then( response => {
    
    if ( response.success ) return; // The content of characters.txt is "65,65,66,67".
    
    console.error( response.error );
    
} );
```

<br/>

### convert

将字符串转换为 unicode 数组，或者将 unicode 数组转换为字符串，unicode 数组的格式是：`[65, 66, 67]`。

**语法**

```js
convert( data );
```

**参数**

- `data`

  `{ string | Array<number> }`

  字符串（如 `"ABC"`）或存储 unicode 编码的数组，比如 `[65, 66, 67]`（基于十进制）。

**返回**

`{ string | Array<number> }`

若入参是字符串，则返回 unicode 数组，若入参是 unicode 数组，则返回字符串。

**范例**

```js
convert( "ABC" );          // output: [ 65, 66, 67 ]
convert( [ 65, 66, 67 ] ); // output: "ABC"
```

<br/>

### deduplication

对字符串或 unicode 数组进行去重。

**语法**

```js
deduplication( data )；
```

**参数**

- `data`

  `{ string | Array<number> }`

  字符串（如 `"ABC"`）或存储 unicode 编码的数组，比如 `[65, 66, 67]`（基于十进制）。

**返回**

`{ string | Array<number> }`

若入参是字符串，则返回去重后的字符串。若入参是 unicode 数组，则返回去重后的 unicode 数组。

**范例**

```js
deduplication( "AABC" );             // output: "ABC"
deduplication( [ 65, 65, 66, 67 ] ); // output: [ 65, 66, 67 ]
```

<br/>

# 许可

该库遵循 [MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE) 。

<br/>

# 版本控制

该库遵循 [语义化版本控制](https://semver.org/lang/zh-CN/) 。

<br/>

# 致谢

感谢 [optntype.js](https://github.com/opentypejs/opentype.js) 的贡献，该库基于 opentype.js。
