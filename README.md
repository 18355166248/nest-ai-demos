# Nest AI Demos - 流式响应系统

这是一个基于 NestJS 和 React 的流式响应演示项目，展示了如何实现真正的 AI 对话流和动态内容生成。

## 🚀 主要特性

### 后端 (NestJS)

- **SSE (Server-Sent Events) 支持**: 使用标准的 `text/event-stream` 格式
- **智能 AI 对话流**: 根据用户输入动态生成智能回复
- **多种响应类型**: 支持故事、代码、解释等不同类型的 AI 响应
- **实时进度跟踪**: 流式进度条显示
- **事件驱动架构**: 支持多种事件类型（start, thinking, response, complete 等）

### 前端 (React)

- **实时流式显示**: 支持逐字符流式输出
- **状态指示器**: 显示当前处理状态
- **可中断操作**: 支持取消正在进行的请求
- **响应式设计**: 现代化的 UI 界面

## 🏗️ 项目结构

```
nest-ai-demos/
├── backend/                 # NestJS后端
│   ├── src/
│   │   ├── streaming/      # 流式响应模块
│   │   │   ├── streaming.controller.ts
│   │   │   └── streaming.service.ts
│   │   └── ...
├── frontend/               # React前端
│   ├── src/
│   │   ├── components/     # 组件
│   │   │   ├── ChatStreaming.tsx
│   │   │   ├── AIStreaming.tsx
│   │   │   └── ProgressStreaming.tsx
│   │   └── ...
└── ...
```

## 🔧 技术栈

- **后端**: NestJS, TypeScript, Node.js
- **前端**: React, TypeScript, CSS3
- **通信**: Server-Sent Events (SSE)
- **包管理**: pnpm

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动后端

```bash
cd backend
pnpm run start:dev
```

### 3. 启动前端

```bash
cd frontend
pnpm start
```

### 4. 访问应用

打开浏览器访问 `http://localhost:3000`

## 📡 API 接口

> **注意**: 流式响应使用 GET 请求而不是 POST 请求，这是因为：
>
> - 更好的缓存兼容性
> - 代理服务器支持更好
> - 浏览器对流式响应的限制更少
> - 更符合 RESTful 设计原则

### 1. 聊天流式响应

```
GET /streaming/chat?message={message}&delay={delay}
```

- **功能**: AI 智能对话流式响应
- **特点**: 根据用户输入智能生成回复，支持逐字符流式输出
- **参数**:
  - `message`: 用户消息（查询参数）
  - `delay`: 字符延迟时间（毫秒，查询参数）

### 2. AI 模拟响应

```
GET /streaming/simulate-ai?prompt={prompt}&responseType={type}&speed={speed}
```

- **功能**: 模拟 AI 流式响应
- **类型**: 故事、代码、解释
- **速度**: 慢速、正常、快速

### 3. 进度流式响应

```
GET /streaming/progress?totalSteps={steps}&stepDelay={delay}
```

- **功能**: 流式进度条显示
- **参数**:
  - `totalSteps`: 总步骤数（查询参数）
  - `stepDelay`: 每步延迟时间（查询参数）

## 🎯 使用示例

### AI 对话示例

1. 输入消息："你好"
2. 系统会智能识别并生成友好回复
3. 支持的关键词：你好、天气、学习、编程、笑话、时间等

### 流式输出效果

- 每个字符按设定延迟时间逐个显示
- 实时状态指示器显示处理进度
- 支持中断和取消操作

## 🔍 技术亮点

### SSE 格式规范

```typescript
// 事件格式
res.write("event: thinking\ndata: 正在思考...\n\n");

// 数据格式
res.write(
  `data: ${JSON.stringify({
    type: "char",
    char: "字",
    position: 0,
    total: 100,
  })}\n\n`
);
```

### 智能回复生成

- 基于关键词的智能识别
- 上下文相关的回复生成
- 多种回复类型支持

### 前端事件处理

- 支持多种事件类型监听
- 实时数据解析和显示
- 优雅的错误处理

## 🎨 自定义配置

### 调整流式速度

```typescript
// 后端延迟设置
const delay = 100; // 毫秒

// 前端可调节
<input
  type="number"
  value={delay}
  onChange={(e) => setDelay(Number(e.target.value))}
  min="10"
  max="1000"
/>;
```

### 添加新的 AI 回复类型

```typescript
// 在 generateAIResponse 方法中添加新逻辑
if (messageLower.includes("新关键词")) {
  response = "新的回复内容";
}
```

## 🚀 部署说明

### 生产环境

```bash
# 构建前端
cd frontend
pnpm run build

# 启动后端
cd backend
pnpm run build
pnpm run start:prod
```

### Docker 部署

```bash
docker-compose up -d
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🆘 问题反馈

如果您遇到问题或有建议，请创建 Issue 或联系开发团队。
