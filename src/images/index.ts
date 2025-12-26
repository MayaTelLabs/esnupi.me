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
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTimeZone,
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(new Date());
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const dateString = `${month}-${day}`;
  const holidays = ['12-25', '01-01', '10-31'];
  const isHoliday = holidays.includes(dateString);
  let validImageFiles = imageFiles.filter((filename) => imageRegex.test(filename));
  if (isHoliday) {
    const holidayFiles = validImageFiles.filter((filename) => filename.includes(dateString));
    if (holidayFiles.length > 0) {
      validImageFiles = holidayFiles;
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