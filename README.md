# refine-font
# 简介

简化字体文件，使其只包含characters中的字符，以减小字体文件的体积（基于 [fontmin](https://github.com/ecomfe/fontmin) ）。

> 创建本项目的原因是 blob 项目需要精简简体中文字体文件，为了厘清字体处理部分的代码，以降低后期维护 blob 代码的心智负担，故单开了本项目，同时本项目也用于方便查看 `fontmin` 对字体文件的处理结果。
>
> 本项目没有难度。

项目中的 `index.html` 文件用于验证简化后的字体族文件的效果。如下图所示，顶行的文本使用了简化后的字体文件，底行的文本使用浏览器默认的字体。

![](./static/image/1.png)



# 使用

1. 执行 `npm install` （下载 `fontmin` ）。
2. 执行 `npm run refine-font` ，该命令会根据 `index.js` 的配置来简化字体文件，完整的字体文件位于 `/static/font/full` 文件夹中，简化的字体文件位于 `/static/font/condensed` 文件夹中。
3. 运行 `index.html` （直接运行），即可使用简化的字体文件的效果。
4. `/script/index.js` 文件用于控制如何简化字体文件，核心代码则是 `/script/fontFilter.js` 文件，请阅读该文件来获知使用细则。



# 许可

[MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE)



# 进度

不再基于 fountain，转而基于 opentype.js。
