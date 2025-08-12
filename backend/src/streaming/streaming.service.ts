import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class StreamingService {

  /**
   * 流式响应聊天消息
   */
  async streamResponse(message: string, delay: number, res: Response): Promise<void> {
    const response = `收到您的消息: "${message}"\n\n我正在处理您的请求...\n`;

    // 逐字符流式输出
    for (let i = 0; i < response.length; i++) {
      res.write(response[i]);
      await this.sleep(delay);
    }

    // 模拟处理过程
    const processingSteps = [
      '正在分析您的消息...',
      '正在生成回复...',
      '正在优化内容...',
      '完成！'
    ];

    for (const step of processingSteps) {
      res.write(`\n${step}`);
      await this.sleep(1000);
    }

    res.end('\n\n流式响应完成！');
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
    const speedMap = { slow: 200, normal: 100, fast: 50 };
    const delay = speedMap[speed] || 100;

    let response = '';

    switch (responseType) {
      case 'story':
        response = `基于您的提示"${prompt}"，我来为您创作一个故事：\n\n从前有一个勇敢的探险家，他踏上了寻找神秘宝藏的旅程。在旅途中，他遇到了各种挑战和困难，但他从未放弃。最终，他不仅找到了宝藏，更重要的是发现了内心的勇气和智慧。这个故事告诉我们，真正的宝藏往往不是金银财宝，而是我们在追求目标过程中获得的成长和收获。`;
        break;

      case 'code':
        response = `基于您的提示"${prompt}"，我来为您生成代码：\n\n\`\`\`javascript\n// 这是一个示例函数\nfunction processData(input) {\n  // 验证输入\n  if (!input || typeof input !== 'string') {\n    throw new Error('输入必须是字符串');\n  }\n  \n  // 处理数据\n  const result = input.trim().toLowerCase();\n  \n  // 返回结果\n  return result;\n}\n\n// 使用示例\nconst output = processData('  Hello World  ');\nconsole.log(output); // 输出: hello world\n\`\`\``;
        break;

      default:
        response = `基于您的提示"${prompt}"，我来为您解释：\n\n这是一个非常有趣的问题。让我从多个角度来分析：\n\n1. 首先，我们需要理解问题的核心\n2. 然后，分析相关的背景信息\n3. 接着，考虑不同的解决方案\n4. 最后，得出最优的结论\n\n通过这样的分析过程，我们可以更好地理解和解决这个问题。`;
        break;
    }

    // 逐字符流式输出
    for (let i = 0; i < response.length; i++) {
      res.write(response[i]);
      await this.sleep(delay);
    }

    res.end('\n\nAI响应完成！');
  }

  /**
   * 流式进度条响应
   */
  async streamProgress(totalSteps: number, stepDelay: number, res: Response): Promise<void> {
    res.write('开始处理任务...\n\n');

    for (let i = 1; i <= totalSteps; i++) {
      const percentage = Math.round((i / totalSteps) * 100);
      const progressBar = this.createProgressBar(percentage, 50);

      res.write(`步骤 ${i}/${totalSteps} - ${percentage}% 完成\n`);
      res.write(`${progressBar}\n`);

      if (i < totalSteps) {
        res.write('正在处理下一步...\n\n');
        await this.sleep(stepDelay);
      }
    }

    res.write('\n🎉 任务完成！\n');
    res.end();
  }

  /**
   * 创建进度条
   */
  private createProgressBar(percentage: number, width: number): string {
    const filledWidth = Math.round((percentage / 100) * width);
    const emptyWidth = width - filledWidth;

    const filled = '█'.repeat(filledWidth);
    const empty = '░'.repeat(emptyWidth);

    return `[${filled}${empty}]`;
  }

  /**
   * 延迟函数
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
