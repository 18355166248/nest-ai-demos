const http = require("http");

// 测试流式聊天响应
function testChatStreaming() {
  console.log("🧪 测试流式聊天响应 (GET)...");

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/streaming/chat?message=你好&delay=100",
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    },
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头:`, res.headers);

    res.on("data", (chunk) => {
      const data = chunk.toString();
      console.log("收到数据:", data);
    });

    res.on("end", () => {
      console.log("✅ 流式聊天响应测试完成");
    });
  });

  req.on("error", (error) => {
    console.error("❌ 请求错误:", error);
  });

  req.end();
}

// 测试AI流式响应
function testAIStreaming() {
  console.log("\n🧪 测试AI流式响应 (GET)...");

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/streaming/simulate-ai?prompt=讲个笑话&responseType=story&speed=normal",
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    },
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头:`, res.headers);

    res.on("data", (chunk) => {
      const data = chunk.toString();
      console.log("收到数据:", data);
    });

    res.on("end", () => {
      console.log("✅ AI流式响应测试完成");
    });
  });

  req.on("error", (error) => {
    console.error("❌ 请求错误:", error);
  });

  req.end();
}

// 测试进度流式响应
function testProgressStreaming() {
  console.log("\n🧪 测试进度流式响应 (GET)...");

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/streaming/progress?totalSteps=5&stepDelay=300",
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      "Cache-Control": "no-cache",
    },
  };

  const req = http.request(options, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头:`, res.headers);

    res.on("data", (chunk) => {
      const data = chunk.toString();
      console.log("收到数据:", data);
    });

    res.on("end", () => {
      console.log("✅ 进度流式响应测试完成");
    });
  });

  req.on("error", (error) => {
    console.error("❌ 请求错误:", error);
  });

  req.end();
}

// 运行所有测试
console.log("🚀 开始测试GET请求的流式响应...\n");

// 延迟执行测试，确保服务器已启动
setTimeout(() => {
  testChatStreaming();

  setTimeout(() => {
    testAIStreaming();

    setTimeout(() => {
      testProgressStreaming();
      console.log("\n🎉 所有测试完成！");
    }, 2000);
  }, 2000);
}, 1000);
