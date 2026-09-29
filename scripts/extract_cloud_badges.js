const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

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

async function extractCloudBadges() {
  const dir = path.join(process.cwd(), 'public', 'images', 'categories');

  for (const cat of categories) {
    const src = path.join(dir, cat.id + '-badge.png');
    const dest = path.join(dir, cat.id + '-cloud.png');
    const dest2x = path.join(dir, cat.id + '-cloud@2x.png');

    // Extract top 92 pixels (the cloud badge itself)
    const badgeMeta = await sharp(src).metadata();
    const cloudHeight = Math.min(92, badgeMeta.height);

    // Crop cloud only
    const cloudBuffer = await sharp(src)
      .extract({ left: 0, top: 0, width: badgeMeta.width, height: cloudHeight })
      .trim()
      .toBuffer();

    // Save 1x and crisp 2x upscaled with lanczos3
    await sharp(cloudBuffer)
      .toFile(dest);

    await sharp(cloudBuffer)
      .resize({ width: 220, kernel: sharp.kernel.lanczos3 })
      .png({ quality: 100 })
      .toFile(dest2x);

    console.log(`Generated cloud badge for ${cat.name} -> ${dest}`);
  }
}

extractCloudBadges().catch(console.error);
