import { Injectable } from "@nestjs/common";
import { Response } from "express";

@Injectable()
export class StreamingService {
  /**
   * 流式响应聊天消息 - 实现动态AI对话流
   */
  async streamResponse(
    message: string,
    delay: number,
    res: Response
  ): Promise<void> {
    try {
      // ​​字段行​​：支持 data、event、id、retry四种字段（每行一个字段）。
      // ​​终止符​​：每条消息必须以​​两个连续换行符 \n\n​​ 结尾。
      // 发送开始事件
      res.write("event: start\ndata: 开始分析您的消息...\n\n");
      await this.sleep(300);

      // 发送分析事件
      res.write("event: analyzing\ndata: 正在分析消息内容...\n\n");
      await this.sleep(500);

      // 生成AI回复
      const aiResponse = await this.generateAIResponse(message);

      // 发送生成开始事件
      res.write("event: generating\ndata: 正在生成回复...\n\n");
      await this.sleep(300);

      // 逐字符流式输出AI回复
      for (let i = 0; i < aiResponse.length; i++) {
        const char = aiResponse[i];

        // 发送字符数据
        res.write(
          `data: ${JSON.stringify({
            type: "chat",
            char,
            position: i,
            total: aiResponse.length,
            percentage: Math.round(((i + 1) / aiResponse.length) * 100),
          })}\n\n`
        );

        // 根据延迟设置等待
        await this.sleep(delay);
      }

      // 发送完成事件
      res.write("event: complete\ndata: 回复生成完成\n\n");
    } catch (error) {
      console.error("流式响应错误:", error);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
      );
    }
  }

  /**
   * 生成AI智能回复
   */
  private async generateAIResponse(userMessage: string): Promise<string> {
    // 模拟AI分析过程
    const messageLower = userMessage.toLowerCase();

    let response = "";

    // 根据用户消息内容智能生成回复
    if (messageLower.includes("你好") || messageLower.includes("hello")) {
      response = "您好！很高兴见到您。我是您的AI助手，有什么可以帮助您的吗？";
    } else if (
      messageLower.includes("天气") ||
      messageLower.includes("weather")
    ) {
      response =
        "关于天气，我建议您查看当地的天气预报应用。不过我可以告诉您，今天是个适合外出活动的好日子！";
    } else if (
      messageLower.includes("学习") ||
      messageLower.includes("study")
    ) {
      response =
        "学习是一个持续的过程！我建议您：\n1. 制定明确的学习目标\n2. 保持专注和耐心\n3. 定期复习和练习\n4. 找到适合自己的学习方法\n\n记住，每一次努力都是进步！";
    } else if (messageLower.includes("编程") || messageLower.includes("code")) {
      response =
        "编程是一门艺术！以下是一些建议：\n\n• 从基础开始，掌握核心概念\n• 多写代码，实践是最好的老师\n• 阅读优秀的开源项目代码\n• 参与编程社区讨论\n• 保持好奇心，持续学习新技术\n\n您想学习哪种编程语言呢？";
    } else if (
      messageLower.includes("谢谢") ||
      messageLower.includes("thank")
    ) {
      response = "不客气！很高兴能帮助到您。如果您还有其他问题，随时可以问我。";
    } else if (messageLower.includes("名字") || messageLower.includes("name")) {
      response =
        "我是您的AI助手，您可以叫我小助手。我擅长回答问题、提供建议和帮助解决问题。";
    } else if (messageLower.includes("时间") || messageLower.includes("time")) {
      const now = new Date();
      response = `现在的时间是：${now.toLocaleString("zh-CN")}。时间宝贵，让我们珍惜每一刻！`;
    } else if (messageLower.includes("笑话") || messageLower.includes("joke")) {
      response =
        "好的，给您讲个笑话：\n\n程序员去超市买东西，妻子说：买个面包，如果看到鸡蛋就买十个。\n程序员回来后，妻子问：怎么买了十个面包？\n程序员说：我看到鸡蛋了。\n\n😄 这个笑话怎么样？";
    } else {
      // 通用智能回复
      response = `您说得很对！"${userMessage}" 这个话题很有趣。让我从几个角度来分析：\n\n1. 首先，这是一个值得深入思考的问题\n2. 其次，我们可以从多个维度来理解\n3. 最后，每个人的观点可能都不同\n\n您能详细说说您的想法吗？我很想听听您的见解。`;
    }

    return response;
  }

  /**
   * 模拟AI流式响应
   */
  async simulateAIStream(
    prompt: string,
    responseType: string,
    speed: string,
    res: Response
  ): Promise<void> {
    const speedMap = { slow: 100, normal: 60, fast: 20 };
    const delay = speedMap[speed] || 100;

    let response = "";

    switch (responseType) {
      case "story":
        response = `基于您的提示"${prompt}"，我来为您创作一个故事：\n\n从前有一个勇敢的探险家，他踏上了寻找神秘宝藏的旅程。在旅途中，他遇到了各种挑战和困难，但他从未放弃。最终，他不仅找到了宝藏，更重要的是发现了内心的勇气和智慧。这个故事告诉我们，真正的宝藏往往不是金银财宝，而是我们在追求目标过程中获得的成长和收获。`;
        break;

      case "code":
        response = `基于您的提示"${prompt}"，我来为您生成代码：\n\n\`\`\`javascript\n// 这是一个示例函数\nfunction processData(input) {\n  // 验证输入\n  if (!input || typeof input !== 'string') {\n    throw new Error('输入必须是字符串');\n  }\n  \n  // 处理数据\n  const result = input.trim().toLowerCase();\n  \n  // 返回结果\n  return result;\n}\n\n// 使用示例\nconst output = processData('  Hello World  ');\nconsole.log(output); // 输出: hello world\n\`\`\``;
        break;

      default:
        response = `基于您的提示"${prompt}"，我来为您解释：\n\n这是一个非常有趣的问题。让我从多个角度来分析：\n\n1. 首先，我们需要理解问题的核心\n2. 然后，分析相关的背景信息\n3. 接着，考虑不同的解决方案\n4. 最后，得出最优的结论\n\n通过这样的分析过程，我们可以更好地理解和解决这个问题。`;
        break;
    }

    // 发送生成开始事件
    res.write("event: generating\ndata: 正在生成内容...\n\n");
    await this.sleep(500);

    // 逐字符流式输出
    for (let i = 0; i < response.length; i++) {
      const char = response[i];

      // 发送字符数据
      res.write(
        `${JSON.stringify({
          type: "char",
          char,
          position: i,
          total: response.length,
        })}\n\n`
      );

      await this.sleep(delay);
    }

    // 发送生成完成事件
    res.write("event: complete\ndata: 内容生成完成\n\n");
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
