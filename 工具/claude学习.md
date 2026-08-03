### CLAUDE.md

CLAUDE.md 是 Claude Code 的「项目宪法」。它不是一次性 prompt，而是每次会话都会被加载的持久化指令集。

优先级：

1、用户当下指令（最高）

2、项目级 CLAUDE.md（当前工作目录）

3、全局 ~/.claude/CLAUDE.md

4、系统默认 prompt（最低）

这套优先级让你能做出分层治理：

全局层写「我所有项目都遵守的原则」（比如：禁止 AI 主动 push、危险命令必须二次确认）
项目层写「这个仓库特有的事实」（技术栈、命令清单、UI 双栈规则、部署方式）
任务层（用户消息）覆盖前两层做临时调整
一份好的项目级 CLAUDE.md 通常包含：项目身份、技术栈速查、命令清单、路径别名、UI 选用规则、提交规则、护栏、Change Delivery Gate（完成 / commit / push 之前必须满足什么）。


### 三挡落地路线图

**个人开发者（最小可用版）**
写一份 50 行的项目 CLAUDE.md：技术栈 + 命令清单 + 提交规则
装 3 个 skill：dev-guide（项目事实来源）、investigate（debug）、ship（提交 PR）
配 Permission allowlist：把日常只读命令放行
1-2 个 Hooks：SessionStart 注入 git 状态，PreToolUse 拦截危险命令

**小团队（5-15 人）**
在个人版基础上加：
公共 Skills 仓库（code-review / qa / release）
团队级 MCP 接入（禅道 / Linear / Figma）
Hooks 加 PostToolUse 自动追加测试结果
CLAUDE.md 加完整 Change Delivery Gate 章节

**大团队（中型公司及以上）**
在小团队版基础上加：
OpenSpec 强制：影响对外行为的变更必须先走 spec
Permission 集中下发：仓库根 .claude/settings.json 定义安全策略
审计 Hooks：所有命令落日志，可追溯
多角色 review 链路：CEO / Eng / Design 三视角 plan review
安全护栏分层：/careful（prod 改动）/ /freeze（沙箱边界）/ /guard（合体）