import { HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

const SUPPORTED_MIMES = ['image/png', 'image/jpeg'];

export const ImageInterceptor = (fieldName: string) => {
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    callback: CallableFunction,
  ) => {
    if (SUPPORTED_MIMES.includes(file.mimetype)) {
      return callback(null, true);
    }

    return callback(new HttpException('Image MIME type not supported', 400));
  };

  return FileInterceptor(fieldName, { fileFilter });
};
