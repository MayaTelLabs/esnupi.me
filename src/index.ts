import { postImage } from './clients/at';
import { getNextImage } from './images';
import * as dotenv from 'dotenv';
dotenv.config();

// EDIT THIS!
function postTextFromImageName(imageName: string): string {
  // Remove the file extension and parse the date
//   const dateParts = imageName.replace('.jpg', '').split('-');
//   const date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2] || 1));

//   // Create a formatter
//   const formatter = new Intl.DateTimeFormat('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   // Format the date
//   return formatter.format(date);
  return 'i dont need this';
}

// EDIT THIS!
function altTextFromImageName(imageName: string): string {
  return 'Peanuts comic strip from .' + (filename);
}

// Shouldn't have to edit this.
async function main() {
  const { LAST_IMAGE_NAME: lastImageName } = process.env;
  const nextImage = await getNextImage({ lastImageName });

  console.log(nextImage.imageName);

  await postImage({
    path: nextImage.absolutePath,
    text: 'Peanuts: (filename)',
    altText: altTextFromImageName(nextImage.imageName),
  });
}

main();
