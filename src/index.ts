import { postImage } from './clients/at';
import { getNextImage } from './images'; 
import * as dotenv from 'dotenv';
dotenv.config();
function altTextFromFilename(filename: string): string {
    const filenameNoJPG = filename.replace(/\.JPG$/i, "");
  return 'Peanuts: ' + (filenameNoJPG);
}
async function main() {
  const nextImage = await getNextImage(); 
  console.log(nextImage.imageName);
  await postImage({
    path: nextImage.absolutePath,
    text: altTextFromFilename(nextImage.imageName),
    altText: altTextFromFilename(nextImage.imageName),
  });
}
main();