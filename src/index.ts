import { postImage } from './clients/at';
import { getNextImage } from './images'; 
import * as dotenv from 'dotenv';
dotenv.config();

// EDIT THIS!
function altTextFromFilename(filename: string): string {
  return 'Peanuts: ' + (filename);
}
async function main() {
  const nextImage = await getRandomImage(); 

  console.log(nextImage.imageName);

  await postImage({
    path: nextImage.absolutePath,
    text: altTextFromFilename(nextImage.imageName),
    altText: altTextFromFilename(nextImage.imageName),
  });
}

main();
