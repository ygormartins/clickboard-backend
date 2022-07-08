import * as sharp from 'sharp';

export const resizeImage = async (image: Buffer, size?: number) => {
  const imageSize = size || 512;

  return sharp(image).resize(imageSize, imageSize).jpeg().toBuffer();
};
