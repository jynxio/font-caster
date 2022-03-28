# font-caster

[English](https://github.com/1337816495/font-caster/blob/main/README.md) | [中文简体](https://github.com/1337816495/font-caster/blob/main/README-ZH.md)

A minimalist font-subsetting library that reduces the size of font files by removing redundant characters. The library runs in the Node.js environment.

<br/>

# Download

```
npm install font-caster
```

<br/>

# Usage

This section describes how to subset fonts based on multiple html files, the steps are as follows:

1. Before we start, let's assume that the directory structure of the workspace is as follows:

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

   `page` is a folder with multiple html files.

   `font.ttf` is the original font file.

   `subset.js` is the subsetting script, its task is to subset fonts based on all html files in `page`.

2. Then import `font-caster` in `subset.js`:

   ```js
   const fc = require( "font-caster" );
   ```

3. Then create a variable ahead of time that will hold the contents of all the html text:

   ```js
   let characters = "";
   ```

4. Then read all the html text (step 1), extract the content of all tags (step 2), and finally accumulate all the content into the `characters` variable (step 3):

   ```js
   const read_response = await fc.read( "./page" );  // step 1
   
   for ( file of read_response.files ) {
       
       const content = fc.parseHtml( file.content ); // step 2
       
       characters += content;                        // step 3
       
   }
   ```

5. Finally, create the subsetting font file:

   ```js
   const subset_response = await fc.subset( characters, "./font.ttf", "./subset-font.ttf" );
   ```

6. Our workspace now has the following directory structure:

   ```
     |- page
     |- font.tff
   + |- subset-font.ttf
     |- subset.js
   ```

<br/>

# API

| name                            | description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| [subset](#subset)               | Subset font file.                                            |
| [parseHtml](#parseHtml)         | Extract the content of the specified tag of the html text.   |
| [read](#read)                   | Read file.                                                   |
| [write](#write)                 | Write to file.                                               |
| [convert](#convert)             | Convert string to unicode array, or convert unicode array to string. |
| [deduplication](#deduplication) | Deduplicate string or unicode array.                         |

<br/>

### subset

(asynchronous) Subsets a font file based on string or unicode array, this method will deduplicate the input.

**Syntax**

```js
subset( data, origin_path, subset_path ).then( _ => _ );
```

**Parameters**

- `data`

  `{ string || Array<number> }`

  A string (like `"ABC"`) or an array storing unicode like `[65, 66, 67]` (decimal based).

- `origin_path`

  `{ string }`

  The path to the original font file, such as `"./origin.otf"`, also supports `ttf`, `woff`.

- `subset_path`

  `{ string }`

  The path of the subsetting font file, such as `"./sunset.otf"`, the format of the subsetting font file must be the same as the format of the original font file.

**Return value**

`{ Promise }`

`Promise` represents whether the execution was successful or not. If it fails, it returns a `{success: false, error}` object. If successful, a `{success: true, information}` object is returned and a subsetting font file is automatically created.

**Examples**

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

Extracts the content of the specified tag from the html text.

This method cannot correctly parse escape characters, for example, it will treat `&gt;` as characters `&`, `g`, `t`, `;`, this bug has been included in the work plan.

**Syntax**

```js
parseHtml( characters, tagnames );
```

**Parameters**

- `characters`

  `{ string }` 

  The content of html text, such as the string obtained by reading an html file with `read`.

- `tagnames`

  `{ undefined | Array<string> }`

  (optional) The default value is `undefined`. if the value is `undefined`, the method will extract the content of all tags. If the value is `[ "h1", "h2" ]`, this method will only extract the contents of all `h1`, `h2` tags, and other tags as well.

  Note: 1.you cannot enter self-closing tags, such as `[ "img" ]`, 2.the tag name is not case-sensitive.

**Return value**

`{ string }`

the content of the tags.

**Examples**

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

(asynchronously) Read a utf-8 encoded text file or all such files in a folder.

For MacOS, this method will misread `.DS_Store` when dealing with folders, you can find and filter it by the `name` and `type` attributes.

**Syntax**

```js
read( path, is_unicode ).then( _ => _ );
```

**Parameters**

- `path`

  `{ string }`

  The path to a file or folder, such as `"./index.html" or "./pages"`.

- `is_unicode`

  `{ boolean }` 

  (optional) The default value is `false`. If the value is `false` , the return value is exactly the same as the text. If the value is `true` , the return value is an array of decimal-based unicode (in this case the API will assume that the content of the text is comma-separated unicode, such as `"64,65,66"`, which is also decimal-based).

**Return value**

`{ Promise }`

`Promise` represents whether the execution succeeded or not. If it fails, it returns a `{success: false, error}` object. If successful, it returns a `{success: true, files}` object, where `files` is an array with at least one `{name, type, path, content}` object.

**Examples**

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

(asynchronously) Write a string or unicode array to a text file.

**Syntax**

```js
write( data, path ).then( _ => _ );
```

**Parameters**

- `data`

  `{ string | Array<number> }`

  String (like `"ABC"`) or unicode array (like `[65, 66, 67]`, based on decimal). If the value is a string, write the string to the text file. If the value is a unicode array, write comma-separated unicode, such as `65,66,67` (based on decimal), to the text file.

- `path`

  `{ string }` 

  Path to a text file, such as `"./characters.txt"`.

**Return value**

`{ Promise }`

`Promise` represents whether the execution succeeded or not. If successful, it returns a `{success: true}` object. If it fails, it returns a `{success: false, error}` object.

**Examples**

If the value of the first parameter is a string.

```js
write( "AABC", "./characters.txt" ).then( response => {
    
    if ( response.success ) return; // The content of characters.txt is "AABC".
    
    console.error( response.error );
    
} );
```

If the value of the first parameter is a unicode array.

```js
write( [ 65, 65, 66, 67 ], "./characters.txt" ).then( response => {
    
    if ( response.success ) return; // The content of characters.txt is "65,65,66,67".
    
    console.error( response.error );
    
} );
```

<br/>

### convert

Convert a string to a unicode array, or convert a unicode array to a string, the format of the unicode array is: `[65, 66, 67]`.

**Syntax**

```js
convert( data );
```

**Parameters**

- `data`

  `{ string | Array<number> }`

  String (like `"ABC"`) or unicode array like `[65, 66, 67]` (decimal based).

**Return value**

`{ string | Array<number> }`

If the parameter is a string, it returns a unicode array. If the parameter is a unicode array, it returns a string.

**Examples**

```js
convert( "ABC" );          // output: [ 65, 66, 67 ]
convert( [ 65, 66, 67 ] ); // output: "ABC"
```

<br/>

### deduplication

Deduplicate string or unicode array.

**Syntax**

```js
deduplication( data )；
```

**Parameters**

- `data`

  `{ string | Array<number> }`

  String (like `"ABC"`) or unicode array like `[65, 66, 67]` (decimal based).

**Return value**

`{ string | Array<number> }`

If parameter is a string, it returns the deduplicated string. If parameter is a unicode array, it returns the deduplicated unicode array.

**Examples**

```js
deduplication( "AABC" );             // output: "ABC"
deduplication( [ 65, 65, 66, 67 ] ); // output: [ 65, 66, 67 ]
```

<br/>

# License

[MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE).

<br/>

# Versioning

[Semantic Versioning 2.0.0](https://semver.org/)

<br/>

# Thanks

Thanks to [optntype.js](https://github.com/opentypejs/opentype.js), the library is based on `opentype.js`.