# 更改日志

## [1.1.0] - 2024-12-19

### 🔄 重大更改

- **流式请求方法迁移**: 将所有流式响应接口从 POST 请求改为 GET 请求
- **参数传递方式**: 从请求体 (request body) 改为查询参数 (query parameters)

### 📝 详细更改

#### 后端更改 (NestJS)

- `StreamingController` 中的装饰器从 `@Post()` 改为 `@Get()`
- 参数装饰器从 `@Body()` 改为 `@Query()`
- Swagger 文档从 `@ApiBody()` 改为 `@ApiQuery()`
- 数据类型处理：查询参数为字符串，需要转换为数字类型

#### 前端更改 (React)

- `AIStreaming.tsx`: 从 POST 请求改为 GET 请求，使用查询参数
- `ChatStreaming.tsx`: 从 POST 请求改为 GET 请求，使用查询参数
- `ProgressStreaming.tsx`: 从 POST 请求改为 GET 请求，使用查询参数
- EventSource 查询参数修复

#### 测试文件更新

- `test-streaming.js`: 更新为 GET 请求
- `test-get-streaming.js`: 新增专门测试 GET 请求的脚本

#### 文档更新

- `README.md`: 更新 API 接口说明，添加 GET 请求的优势说明

### 🎯 为什么使用 GET 请求？

流式响应使用 GET 请求而不是 POST 请求的原因：

1. **缓存兼容性**: GET 请求更容易被缓存系统处理
2. **代理支持**: 代理服务器对 GET 请求的流式响应支持更好
3. **浏览器限制**: 浏览器对 POST 请求的流式响应有限制
4. **RESTful 设计**: 更符合 REST 架构原则
5. **连接稳定性**: GET 请求的连接保持更稳定

### 🔧 新的 API 格式

#### 聊天流式响应

```
GET /streaming/chat?message={message}&delay={delay}
```

#### AI 模拟响应

```
GET /streaming/simulate-ai?prompt={prompt}&responseType={type}&speed={speed}
```

#### 进度流式响应

```
GET /streaming/progress?totalSteps={steps}&stepDelay={delay}
```

### 🚀 兼容性说明

- 此更改是破坏性更改，需要更新前端代码
- 所有参数现在通过 URL 查询字符串传递
- 数字类型参数会自动转换（字符串 → 数字）

### 📋 测试建议

1. 使用 `test-get-streaming.js` 验证 GET 请求功能
2. 检查前端组件是否正常工作
3. 验证 Swagger 文档是否正确显示
4. 测试不同参数组合的响应
