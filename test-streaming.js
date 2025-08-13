#!/usr/bin/env node

/**
 * 流式响应系统测试脚本
 * 测试所有三个接口的功能
 */

const fetch = require("node-fetch");

async function testStreamingChat() {
  console.log("🧪 测试流式聊天响应...\n");

  try {
    const response = await fetch(
      "http://localhost:3000/streaming/chat?message=你好，请介绍一下你自己&delay=50",
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("✅ 连接成功，开始接收流式数据...\n");
    console.log("📡 接收到的数据:\n");

    // 使用 node-fetch v2 的流式处理方式
    response.body.on("data", (chunk) => {
      const chunkStr = chunk.toString();
      const lines = chunkStr.split("\n");

      for (const line of lines) {
        if (line.trim()) {
          if (line.startsWith("event:")) {
            const eventType = line.substring(6).trim();
            console.log(`🎯 事件: ${eventType}`);
          } else if (line.startsWith("data:")) {
            const data = line.substring(5).trim();

            try {
              const parsedData = JSON.parse(data);

              if (parsedData.type === "char") {
                process.stdout.write(parsedData.char);
              } else {
                console.log(`📊 数据: ${data}`);
              }
            } catch {
              if (
                data &&
                !data.includes("开始处理") &&
                !data.includes("响应完成")
              ) {
                console.log(`📝 内容: ${data}`);
              }
            }
          }
        }
      }
    });

    response.body.on("end", () => {
      console.log("\n🏁 流式响应完成");
    });

    response.body.on("error", (error) => {
      console.error("❌ 流式读取错误:", error.message);
    });
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
  }
}

// 运行测试
testStreamingChat();
