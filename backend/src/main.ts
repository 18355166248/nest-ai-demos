import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 启用CORS
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // 配置Swagger文档
  const config = new DocumentBuilder()
    .setTitle('流式响应API')
    .setDescription('用于调试流式响应结果的后端API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
  console.log('后端服务已启动在 http://localhost:3001');
  console.log('API文档地址: http://localhost:3001/api');
}
bootstrap();
