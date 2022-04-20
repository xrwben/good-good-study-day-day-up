## 常用插件

1. Visual Studio Intellicode

这个插件旨在帮助开发人员提供智能的代码完成建议而构建的，并且已预先构建了对多种编程语言的支持。


2. Git Blame

它会告诉你最后接触一行代码的人是谁


3. ESLint

ESLint就会作为一个静态分析代码的工具来快速发现问题


4. 汉化Chinese


5. Auto Rename Tag


6. vetur

（vue2）不用了 升级volar兼容

7. volar

vue3开发必备插件

8. Stylelint

样式检测规则

 


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
```