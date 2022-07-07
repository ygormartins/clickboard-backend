import { Module } from '@nestjs/common';
import { RedisProviders } from './redis.providers';

@Module({
  imports: [...RedisProviders],
  exports: [...RedisProviders],
})
export class RedisModule {}
