## 常用插件

1. Visual Studio Intellicode -这个插件旨在帮助开发人员提供智能的代码完成建议而构建的，并且已预先构建了对多种编程语言的支持。

2. Git Blame -它会告诉你最后接触一行代码的人是谁

3. ESLint -ESLint就会作为一个静态分析代码的工具来快速发现问题

4. 汉化Chinese

5. Auto Rename Tag -自动重命名对应标签（内置）

6. vetur  -（vue2）不用了 升级volar兼容

7. volar -vue3开发必备插件

8. Stylelint -样式检测规则

9. Thunder Client -类似于postman接口调试工具

10. Live Server -当前文件目录快速起个服务，类似http-server功能

11. Prettier -格式化代码工具，可以手动格式化

12. Path IntelliSence - 路劲提示补全（内置）

13. Emmet - HTML/CSS提示（内置）

14. EditorConfig for VS Code - 编辑器格式

 


### VSCode 编辑器setting.config配置

踩坑解决方案： vscode(1.66.2) [https://zhuanlan.zhihu.com/p/94175872]

```json
"editor.codeActionsOnSave": {
    "source.fixAll.stylelint": true,
    "source.fixAll": true
},
"eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
],
"eslint.alwaysShowStatus": true,
"stylelint.validate": [
    "css",
    "less",
    "postcss",
    "scss",
    "vue",
    "sass"
],
// vue单文件html和css提示
"emmet.includeLanguages": {
    "vue-html": "html",
    "vue": "html",
    "javascript": "javascriptreact"
},
"files.associations": {
    "*.vue": "html"
}

// eslint配置文件默认只在根目录生效，如果有子目录则需要配置eslint工作目录
"eslint.workingDirectories": [
    { "mode": "auto" },
    // { "directory": "app", "changeProcessCWD": true }
],
```

### 参考配置

https://maomao.fe-mm.com/efficiency/software/vscode


### Prettier配置说明

```json
{
    "printWidth": 80,
    "tabWidth": 2,
    "useTabs": false,
    "semi": false,
    "singleQuote": true,
    "quoteProps": "as-needed", // 对象属性是否添加引号
    "jsxSingleQuote": false,
    "trailingComma": "none", // 尾随逗号
    "bracketSpacing": true, // 花括号前后空格
    "jsxBracketSameLine": false, // jsx中>是否在末尾
    "arrowParens": "always", // 箭头函数括号添加方式
    "rangeStart": 0, // 格式化开始范围
    "rangeEnd": Infinity, // 格式化结束范围
    "parser": "babel", // 代码解析器
    "filepath": null, // 文件路径
    "requirePragma": false, // 是否文件顶部有特定注释才格式化
    "insertPragma": false, // 是否在文件顶部插入特定注释，表示文件已格式化
    "proseWrap": "preserve", // Markdown 文件保留原始换行
    "htmlWhitespaceSensitivity": "css", // 控制 HTML 文件中空格的敏感度
    "vueIndentScriptAndStyle": false, // 是否在 Vue 文件中缩进 <script> 和 <style> 标签内的代码
    "endOfLine": "lf", // 控制文件的行尾字符
    "embeddedLanguageFormatting": "auto" // 是否格式化嵌入在其他语言中的代码（如 HTML 中的 JavaScript）
}
```