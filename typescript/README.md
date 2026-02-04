// 此文件由命令 tsc -init 生成
// 直接运行 tsc 命令就会运用此配置文件
// 选项详解：https://www.tslang.cn/docs/handbook/compiler-options.html
{
  // "include": ["demo15-1.ts"],              // 要编译的指定文件，不配置此项时运行tsc默认编译全部
  // "files": ["demo15-1.ts"],                // 和include类似
  // "exclude": ["demo15-3.ts"],              // 要排除编译的指定文件
  "compilerOptions": {
    // 编译选项
    /* 基本选项 */
    // "incremental": true,                   /* 启用增量编译 */
    "target": "es5" /* 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019' or 'ESNEXT'. */,
    "module": "commonjs" /* 指定模块代码生成: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
    // "lib": [],                             /* 指定要包含在编译中的库文件. */
    // "allowJs": true,                       /* 允许编译javascript文件*/
    // "checkJs": true,                       /* 报告.js文件中的错误。 */
    // "jsx": "preserve",                     /* 指定 JSX代码生成: 'preserve', 'react-native', or 'react'. */
    // "declaration": true,                   /* 生成相应的 .d.ts文件 */
    // "declarationMap": true,                /* 为每个相应的 .d.ts文件生成一个sourcemap (编译后代码对源码的映射)*/
    "sourceMap": true /* 生成源文件与输出文件的映射关系文件(.map)。*/,
    // "outFile": "./",                       /* 将输出文件合并为一个文件. */
    "outDir": "./build" /* 输出的js文件目录。 */,
    "rootDir": "./src" /* ts源文件目录。 */,
    // "composite": true,                     /* 启用 项目编译 */
    // "tsBuildInfoFile": "./",               /* 指定用于存储增量编译信息的文件 */
    // "removeComments": true,                /* 不输出注释到编译结果.（删除所有注释，除了以 /!*开头的版权信息。） */
    // "noEmit": true,                        /* 不发出输出.Do not emit outputs. */
    // "importHelpers": true,                 /* 从“tslib”导入发出助手. Import emit helpers from 'tslib'. */
    // "downlevelIteration": true,            /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */
    // "isolatedModules": true,               /* 将每个文件作为单独的模块（与“ts.transpileModule”类似） */

    /* 严格的类型检查选项 */
    "strict": true /* 启用所有严格类型检查选项。 打开此选项后，下面这些选项就不需要单独设置*/,
    // "noImplicitAny": true,                 /* 对隐含的“any”类型的表达式和声明引发错误. (为false时允许any不用特意声明)*/
    // "strictNullChecks": true,              /* 启用严格的null检查. (为false时允许赋值为null)*/
    // "strictFunctionTypes": true,           /* 启用严格检查函数类型. */
    // "strictBindCallApply": true,           /* 启用函数上严格的“bind”、“call”和“apply”方法. */
    // "strictPropertyInitialization": true,  /* 启用 严格检查类中的属性初始化. */
    // "noImplicitThis": true,                /* 在隐含的“any”类型的“this”表达式上引发错误。 */
    // "alwaysStrict": true,                  /* 以严格模式解析并为每个源文件发出“use strict”。 */

    /* 附加检查。Additional Checks  */
    // "noUnusedLocals": true,                /* 若有未使用的局部变量则抛错 */
    // "noUnusedParameters": true,            /* 若有未使用的参数则抛错。 */
    // "noImplicitReturns": true,             /* 不是函数的所有返回路径都有返回值时报错。*/
    // "noFallthroughCasesInSwitch": true,    /* 报告switch语句的fallthrough错误。（即，不允许switch的case语句贯穿） */

    /* 模块解析选项 */
    // "moduleResolution": "node",            /* 决定如何处理模块：'node' (Node.js) or 'classic' (TypeScript pre-1.6). */
    // "baseUrl": "./",                       /* 用于解析非绝对模块名称的基础目录。 */
    // "paths": {},                           /* 模块名到基于 baseUrl的路径映射的列表。 */
    // "rootDirs": [],                        /* List of root folders whose combined content represents the structure of the project at runtime. */
    // "typeRoots": [],                       /* List of folders to include type definitions from. */
    // "types": [],                           /* 要包含的类型声明文件名列表 */
    // "allowSyntheticDefaultImports": true,  /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */
    "esModuleInterop": true /* 启用s emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */
    // "preserveSymlinks": true,              /* Do not resolve the real path of symlinks. */
    // "allowUmdGlobalAccess": true,          /* Allow accessing UMD globals from modules. */

    /* Source Map Options */
    // "sourceRoot": "",                      /* Specify the location where debugger should locate TypeScript files instead of source locations. */
    // "mapRoot": "",                         /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSourceMap": true,               /* Emit a single file with source maps instead of having a separate file. */
    // "inlineSources": true,                 /* Emit the source alongside the sourcemaps within a single file; requires '--inlineSourceMap' or '--sourceMap' to be set. */

    /* Experimental Options */
    // "experimentalDecorators": true,        /* 启用s experimental support for ES7 decorators. */
    // "emitDecoratorMetadata": true,         /* 启用s experimental support for emitting type metadata for decorators. */
  }
}
