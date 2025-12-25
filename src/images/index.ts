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
  const targetTimeZone = 'America/New_York';
  const dateParts = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTimeZone,
    month: 'numeric',
    day: 'numeric'
  }).formatToParts(new Date());
  const month = parseInt(dateParts.find(p => p.type === 'month')?.value || '0');
  const day = parseInt(dateParts.find(p => p.type === 'day')?.value || '0');
  const isChristmas = (month === 12 && day === 25);
  let validImageFiles = imageFiles.filter((filename) => imageRegex.test(filename));
  if (isChristmas) {
    const christmasFiles = validImageFiles.filter((filename) => filename.includes('12-25'));
    if (christmasFiles.length > 0) {
      validImageFiles = christmasFiles;
    }
  }
  if (validImageFiles.length === 0) {
    throw new Error('No valid image files found.');
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