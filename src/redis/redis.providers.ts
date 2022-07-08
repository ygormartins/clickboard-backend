import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

export const RedisProviders = [
  RedisModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      config: {
        url: configService.get('REDIS_URL'),
      },
    }),
  }),
];
