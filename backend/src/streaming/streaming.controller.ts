import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { StreamingService } from './streaming.service';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('流式响应')
@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Post('chat')
  @ApiOperation({ summary: '流式聊天响应' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: '用户输入的消息' },
        delay: { type: 'number', description: '每个字符的延迟时间(毫秒)', default: 100 }
      },
      required: ['message']
    }
  })
  async streamChat(@Body() body: { message: string; delay?: number }, @Res() res: Response) {
    const { message, delay = 100 } = body;

    if (!message) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: '消息不能为空' });
    }

    // 设置响应头，启用流式传输
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await this.streamingService.streamResponse(message, delay, res);
    } catch (error) {
      console.error('流式响应错误:', error);
      res.end('错误: ' + error.message);
    }
  }

  @Post('simulate-ai')
  @ApiOperation({ summary: '模拟AI流式响应' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'AI提示词' },
        responseType: { type: 'string', enum: ['story', 'code', 'explanation'], description: '响应类型' },
        speed: { type: 'string', enum: ['slow', 'normal', 'fast'], description: '响应速度', default: 'normal' }
      },
      required: ['prompt']
    }
  })
  async simulateAIResponse(
    @Body() body: { prompt: string; responseType?: string; speed?: string },
    @Res() res: Response
  ) {
    const { prompt, responseType = 'explanation', speed = 'normal' } = body;

    if (!prompt) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: '提示词不能为空' });
    }

    // 设置响应头
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await this.streamingService.simulateAIStream(prompt, responseType, speed, res);
    } catch (error) {
      console.error('AI流式响应错误:', error);
      res.end('错误: ' + error.message);
    }
  }

  @Post('progress')
  @ApiOperation({ summary: '进度条流式响应' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        totalSteps: { type: 'number', description: '总步骤数', default: 10 },
        stepDelay: { type: 'number', description: '每步延迟时间(毫秒)', default: 500 }
      }
    }
  })
  async streamProgress(
    @Body() body: { totalSteps?: number; stepDelay?: number },
    @Res() res: Response
  ) {
    const { totalSteps = 10, stepDelay = 500 } = body;

    // 设置响应头
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
      await this.streamingService.streamProgress(totalSteps, stepDelay, res);
    } catch (error) {
      console.error('进度流式响应错误:', error);
      res.end('错误: ' + error.message);
    }
  }
}
