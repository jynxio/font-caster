# font-filter
# 简介

过滤字体族文件，使其只包含指定字符，以减小字体文件的体积（基于 [fontmin](https://github.com/ecomfe/fontmin) ）。

项目中的 `index.html` 文件用于验证字体族过滤的结果，如下图所示，顶行的文本使用了过滤后的字体文件，底行的文本使用浏览器默认的字体族。

![](./static/image/1.png)

# 使用

1. 执行 `npm install` （下载 `fontmin` ）。
2. 执行 `npm run filter` ，进行字体过滤，完整的字体族文件位于 `/static/font/full` 文件夹中，生成的字体族文件位于 `/static/font/condensed` 文件夹中。
3. 运行 `index.html` （直接运行），即可试用生成的字体文件。
4. 若要过滤不同的字符集，请修改 `/script/index.js` 文件，该文件是控制如何过滤字体族文件的入口。过滤字体族文件的核心代码位于 `/script/fontFilter.js` 中，请阅读该文件来获知使用细则。

# 许可

[MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE)

创建本项目的原因是 blob 项目需要精简汉字字体族文件，为了厘清字体处理部分的代码，以降低后期维护 blob 代码的心智负担，故单开了本项目，同时本项目也用于方便查看 `fontmin` 对字体族文件的处理结果。

本项目没有难度。
