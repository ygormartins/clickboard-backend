import * as dotenv from 'dotenv';
import * as path from 'path';

export class ConfigService {
  constructor() {
    const envFilePath = path.resolve(
      process.cwd(),
      `.env.${process.env.NODE_ENV || 'development'}`,
    );
    dotenv.config({ path: envFilePath });
  }

  get(key: string): string {
    return process.env[key];
  }
}
