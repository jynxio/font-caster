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

> 注意：不要对 `.woff2` 字体启用 gzip。

# 范例

正在编辑...



# API

正在编辑...



# 许可

本项目遵循 [MIT License](https://github.com/1337816495/font-filter/blob/main/LICENSE) 。



# 版本控制

本项目遵循 [语义化版本控制](https://semver.org/lang/zh-CN/) 。
