import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

type RandomImage = {
  imageName: string;
  absolutePath: string;
};
async function getNextImage(): Promise<RandomImage> {
  const readdir = util.promisify(fs.readdir);
  const imagesDir = path.resolve(__dirname, '../../imagequeue'); 
  let imageFiles: string[];
  try {
    imageFiles = await readdir(imagesDir);
  } catch (error) {
    throw new Error(`Failed to read directory ${imagesDir}: ${error.message}`);
  }
  const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;
  const validImageFiles = imageFiles.filter((filename) => imageRegex.test(filename));

  if (validImageFiles.length === 0) {
    throw new Error('No image files found in the directory.');
  }
  const randomIndex = Math.floor(Math.random() * validImageFiles.length);
  const imageName = validImageFiles[randomIndex];
  const absolutePath = path.join(imagesDir, imageName);
  return {
    imageName,
    absolutePath,
  };
}
export { getNextImage };