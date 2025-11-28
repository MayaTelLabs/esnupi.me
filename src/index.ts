import { postImage } from './clients/at';
import { getNextImage } from './images'; 
import * as dotenv from 'dotenv';
dotenv.config();
function formatDateString(dateString: string): string {
    const dateObj = new Date(dateString + 'T12:00:00'); 
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', options).format(dateObj);
}
function altTextFromFilename(filename: string): string {
    const filenameNoJPG = filename.replace(/\.JPG$/i, "");
    const formattedDate = formatDateString(filenameNoJPG);
    return 'The Peanuts comic strip, drawn by Charles M. Schulz, originally released ' + formattedDate;
}
function postCaptionFromFilename(filename: string): string {
  const filenameNoJPG = filename.replace(/\.JPG$/i, "");
  const formattedDate = formatDateString(filenameNoJPG);
  return 'Peanuts by Schulz: ' + formattedDate; 
}
async function main() {
  const nextImage = await getNextImage(); 
  console.log(nextImage.imageName);
  await postImage({
    path: nextImage.absolutePath,
    text: postCaptionFromFilename(nextImage.imageName),
    altText: altTextFromFilename(nextImage.imageName),
  });
}
main();