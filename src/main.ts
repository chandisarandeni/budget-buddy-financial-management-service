import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix BEFORE listening
  app.setGlobalPrefix('/api/v1');

  // Get database instance
  const dataSource = app.get(DataSource);

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('✅ Database connected successfully!');
    } else {
      console.log('✅ Database was already connected!');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }

  // Only call listen once
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
