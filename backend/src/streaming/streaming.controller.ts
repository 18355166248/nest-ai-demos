import { Controller, Get, Query, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { StreamingService } from "./streaming.service";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";

@ApiTags("流式响应")
@Controller("streaming")
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Get("chat")
  @ApiOperation({ summary: "流式聊天响应" })
  @ApiQuery({ name: "message", description: "用户输入的消息", required: true })
  @ApiQuery({
    name: "delay",
    description: "每个字符的延迟时间(毫秒)",
    required: false,
  })
  async streamChat(
    @Query("message") message: string,
    @Query("delay") delay: string = "100",
    @Res() res: Response
  ) {
    const delayNum = parseInt(delay, 10) || 100;

    if (!message) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: "消息不能为空" });
    }

    // 设置SSE响应头
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      // 发送开始事件
      res.write("event: start\ndata: 开始处理您的消息...\n\n");

      res.flushHeaders();

      // 调用流式响应服务
      this.streamingService.streamResponse(message, delayNum, res);

      // 响应完成
      // res.end();
    } catch (error) {
      console.error("流式响应错误:", error);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
      );
      res.end();
    }
  }

  @Get("simulate-ai")
  @ApiOperation({ summary: "模拟AI流式响应" })
  @ApiQuery({ name: "prompt", description: "AI提示词", required: true })
  @ApiQuery({
    name: "responseType",
    description: "响应类型",
    required: false,
    enum: ["story", "code", "explanation"],
  })
  @ApiQuery({
    name: "speed",
    description: "响应速度",
    required: false,
    enum: ["slow", "normal", "fast"],
  })
  async simulateAIResponse(
    @Query("prompt") prompt: string,
    @Query("responseType") responseType: string = "explanation",
    @Query("speed") speed: string = "normal",
    @Res() res: Response
  ) {
    if (!prompt) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: "提示词不能为空" });
    }

    // 设置SSE响应头
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      // 发送开始事件
      res.write("event: start\ndata: 开始生成AI响应...\n\n");

      await this.streamingService.simulateAIStream(
        prompt,
        responseType,
        speed,
        res
      );

      // 发送完成事件
      res.write("event: complete\ndata: AI响应生成完成\n\n");
      res.end();
    } catch (error) {
      console.error("AI流式响应错误:", error);
      res.write(
        `event: error\ndata: ${JSON.stringify({ error: error.message })}\n\n`
      );
      res.end();
    }
  }
}
