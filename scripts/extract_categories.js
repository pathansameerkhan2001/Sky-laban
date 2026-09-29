const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processCategories() {
  const inputPath = 'C:/Users/Welcome/.gemini/antigravity-ide/brain/1f2c421e-a706-4721-bec1-303b36a0277d/.user_uploaded/media_1790667804315.png';
  const metadata = await sharp(inputPath).metadata();
  console.log('Image metadata:', metadata.width, metadata.height, metadata.channels);

  const outDir = path.join(process.cwd(), 'public', 'images', 'categories');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.copyFileSync(inputPath, path.join(process.cwd(), 'public', 'images', 'categories_strip_reference.png'));

  const categories = [
    { id: 'gulstha', name: 'Gulstha' },
    { id: 'salankatia', name: 'Salankatia' },
    { id: 'koushiri', name: 'Koushiri' },
    { id: 'ruh-hayati', name: 'Ruh Hayati' },
    { id: 'lou-a', name: "Lou'a" },
    { id: 'hiba-cake', name: 'Hiba Cake' },
    { id: 'cakes', name: 'Cakes' },
    { id: 'kunafa-pastry', name: 'Kunafa & Pastry' },
    { id: 'traditional-desserts', name: 'Traditional Desserts' },
    { id: 'special', name: 'Special' },
  ];

  const totalW = metadata.width;
  const totalH = metadata.height;

  for (let i = 0; i < categories.length; i++) {
    const left = Math.floor((i * totalW) / 10);
    const right = Math.floor(((i + 1) * totalW) / 10);
    const width = right - left;
    const top = 0;
    const height = totalH;

    console.log(`Extracting [${i}] ${categories[i].id}: left=${left}, width=${width}, top=${top}, height=${height}`);
    const outFile = path.join(outDir, `${categories[i].id}.png`);

    await sharp(inputPath)
      .extract({ left, top, width, height })
      .toFile(outFile);

    console.log(`Saved ${categories[i].id}`);
  }
}

processCategories().catch(console.error);
