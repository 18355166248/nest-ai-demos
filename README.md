# 流式响应调试项目

这是一个用于调试和测试流式响应结果的全栈应用，包含前端 React 应用和后端 NestJS API 服务。

## 项目结构

```
nest-ai-demos/
├── backend/                 # 后端NestJS服务
│   ├── src/
│   │   ├── streaming/      # 流式响应相关模块
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
├── frontend/               # 前端React应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 功能特性

### 后端 API (NestJS)

- **聊天流式响应** (`POST /streaming/chat`) - 逐字符流式输出聊天消息
- **AI 流式响应** (`POST /streaming/simulate-ai`) - 模拟 AI 的流式响应，支持故事、代码、解释等类型
- **进度条流式响应** (`POST /streaming/progress`) - 流式更新进度条状态
- **Swagger API 文档** - 访问 `http://localhost:3001/api`

### 前端界面 (React)

- **聊天流式响应** - 测试聊天消息的流式输出，可调整字符延迟
- **AI 流式响应** - 测试 AI 的流式响应，支持不同响应类型和速度
- **进度条流式响应** - 测试进度条的流式更新，可调整步骤数量和延迟
- **实时响应显示** - 实时显示流式响应内容
- **请求控制** - 支持开始、停止流式请求

## 快速开始

### 1. 启动后端服务

```bash
cd backend
npm install
npm run start:dev
```

后端服务将在 `http://localhost:3001` 启动

### 2. 启动前端应用

```bash
cd frontend
npm install
npm start
```

前端应用将在 `http://localhost:3000` 启动

### 3. 访问应用

- 前端界面: http://localhost:3000
- API 文档: http://localhost:3001/api
- 健康检查: http://localhost:3001/health

## 技术栈

### 后端

- **NestJS** - Node.js 框架
- **TypeScript** - 类型安全
- **Express** - HTTP 服务器
- **Swagger** - API 文档

### 前端

- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **Fetch API** - 流式请求处理
- **CSS3** - 现代化样式

## 流式响应原理

本项目使用以下技术实现流式响应：

1. **后端**: 使用 `res.write()` 逐字符/逐块发送数据
2. **前端**: 使用 `ReadableStream` 和 `TextDecoder` 处理流式数据
3. **实时更新**: 通过 React 状态管理实时显示接收到的数据

## 调试功能

- **字符级流式输出** - 可以调整每个字符的延迟时间
- **多种响应类型** - 支持文本、代码、故事等不同类型
- **速度控制** - 可调整流式响应的速度
- **进度可视化** - 实时显示处理进度
- **错误处理** - 完善的错误处理和用户反馈

## 开发说明

### 添加新的流式响应类型

1. 在 `backend/src/streaming/streaming.service.ts` 中添加新的方法
2. 在 `backend/src/streaming/streaming.controller.ts` 中添加对应的端点
3. 在前端添加对应的组件和界面

### 自定义流式响应逻辑

可以修改 `StreamingService` 中的方法来自定义：

- 响应内容格式
- 流式输出的节奏
- 错误处理逻辑
- 响应头设置

## 注意事项

- 确保前后端端口配置正确（前端 3000，后端 3001）
- 流式响应需要现代浏览器支持
- 长时间运行的流式请求可以通过停止按钮中断
- 建议在开发环境中使用，生产环境需要添加适当的错误处理和限流

## 许可证

MIT License
