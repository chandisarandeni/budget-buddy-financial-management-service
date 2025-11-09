import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import cors from 'cors';
import oracledb from 'oracledb';
import path from 'path';

dotenv.config();

// ✅ Initialize Oracle Client (Thick Mode)
try {
  const clientPath = path.resolve('C:/oracle/instantclient_23_9');
  oracledb.initOracleClient({ libDir: clientPath });
  console.log('✅ Oracle Instant Client initialized (Thick Mode).');
} catch (err) {
  console.error('❌ Failed to initialize Oracle Instant Client:', err);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  app.setGlobalPrefix('/api/v1');

  const dataSource = app.get(DataSource);

  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('✅ Database connected successfully!');
    } else {
      console.log('✅ Database already initialized!');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}

bootstrap();
