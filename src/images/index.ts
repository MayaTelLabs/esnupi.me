import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import Holidays from 'date-holidays';
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
  const hd = new Holidays('US');
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: targetTimeZone, month: '2-digit', day: '2-digit', year: 'numeric'
  });
  const parts = formatter.formatToParts(now);
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const year = parseInt(parts.find(p => p.type === 'year')?.value || '2025');
  const dateString = `${month}-${day}`;
  const todayHolidays = hd.isHoliday(now);
  const isThanksgivingToday = todayHolidays && todayHolidays.some(h => h.name === 'Thanksgiving Day');
  const fixedHolidays = ['12-25', '01-01', '10-31'];
  const isFixedHoliday = fixedHolidays.includes(dateString);
  let validImageFiles = imageFiles.filter((filename) => imageRegex.test(filename));
  if (isThanksgivingToday) {
    const thanksgivingDateStrings: string[] = [];
    for (let y = 1945; y <= year; y++) {
      const yearlyHolidays = hd.getHolidays(y);
      const tg = yearlyHolidays.find(h => h.name === 'Thanksgiving Day');
      if (tg) {
        const tgDate = new Date(tg.date);
        const m = (tgDate.getMonth() + 1).toString().padStart(2, '0');
        const d = tgDate.getDate().toString().padStart(2, '0');
        thanksgivingDateStrings.push(`${m}-${d}`);
      }
    }
    const thanksgivingFiles = validImageFiles.filter((filename) => 
      thanksgivingDateStrings.some(date => filename.includes(date))
    );
    if (thanksgivingFiles.length > 0) {
      validImageFiles = thanksgivingFiles;
    }
  } else if (isFixedHoliday) {
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
  return { imageName, absolutePath };
}
export { getNextImage };