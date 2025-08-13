const fetch = require("node-fetch");

async function testMessage(message, delay = 100) {
  console.log(`\n🧪 测试消息: "${message}" (延迟: ${delay}ms)`);
  console.log("─".repeat(50));

  try {
    const response = await fetch("http://localhost:3000/streaming/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, delay }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    let aiResponse = "";
    let events = [];

    return new Promise((resolve, reject) => {
      response.body.on("data", (chunk) => {
        const chunkStr = chunk.toString();
        const lines = chunkStr.split("\n");

        for (const line of lines) {
          if (line.trim()) {
            if (line.startsWith("event:")) {
              const eventType = line.substring(6).trim();
              events.push(eventType);
              console.log(`🎯 ${eventType}`);
            } else if (line.startsWith("data:")) {
              const data = line.substring(5).trim();

              try {
                const parsedData = JSON.parse(data);

                if (parsedData.type === "char") {
                  process.stdout.write(parsedData.char);
                  aiResponse += parsedData.char;
                } else {
                  console.log(`📊 ${data}`);
                }
              } catch {
                if (
                  data &&
                  !data.includes("开始处理") &&
                  !data.includes("响应完成")
                ) {
                  console.log(`📝 ${data}`);
                }
              }
            }
          }
        }
      });

      response.body.on("end", () => {
        console.log("\n✅ 测试完成");
        resolve({ aiResponse, events });
      });

      response.body.on("error", (error) => {
        reject(error);
      });
    });
  } catch (error) {
    console.error("❌ 测试失败:", error.message);
    return null;
  }
}

async function runComprehensiveTest() {
  console.log("🚀 开始全面流式响应测试...\n");

  const testCases = [
    { message: "你好", delay: 50 },
    { message: "今天天气怎么样？", delay: 80 },
    { message: "我想学习编程", delay: 60 },
    { message: "讲个笑话", delay: 70 },
    { message: "现在几点了？", delay: 40 },
  ];

  const results = [];

  for (const testCase of testCases) {
    const result = await testMessage(testCase.message, testCase.delay);
    if (result) {
      results.push({
        message: testCase.message,
        aiResponse: result.aiResponse,
        events: result.events,
      });
    }

    // 等待一下再进行下一个测试
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n📊 测试结果汇总:");
  console.log("─".repeat(60));

  results.forEach((result, index) => {
    console.log(`\n${index + 1}. 消息: "${result.message}"`);
    console.log(`   事件: ${result.events.join(" → ")}`);
    console.log(`   回复长度: ${result.aiResponse.length} 字符`);
    console.log(`   回复预览: ${result.aiResponse.substring(0, 50)}...`);
  });

  console.log("\n🎉 所有测试完成！");
  console.log(
    "\n💡 提示: 现在可以打开浏览器访问 http://localhost:3000 查看前端界面"
  );
}

// 运行全面测试
runComprehensiveTest().catch(console.error);
