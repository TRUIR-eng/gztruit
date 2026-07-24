const https = require('https');
const fs = require('fs');
const path = require('path');

// Check TR5202 image - is it real or broken?
function checkImage(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8 && buf[buf.length-2] === 0xFF && buf[buf.length-1] === 0xD9;
        const isPng = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47;
        const isGif = buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46;
        const isHtml = buf.toString('utf8', 0, 100).includes('<!DOCTYPE') || buf.toString('utf8', 0, 100).includes('<html');
        console.log(`  ${url.split('/').pop()}: ${res.statusCode} | ${buf.length} bytes | JPEG:${isJpeg} PNG:${isPng} GIF:${isGif} HTML:${isHtml}`);
        resolve({ url, status: res.statusCode, size: buf.length, isJpeg, isPng, isGif, isHtml });
      });
    });
    req.on('error', (e) => resolve({ url, status: 0, error: e.message }));
  });
}

async function main() {
  console.log('=== 检查 products/ 目录下的图片文件 ===\n');
  
  const images = [
    'https://truir-eng.github.io/gztruit/products/TR5202_F1_impact_tester.jpeg',
    'https://truir-eng.github.io/gztruit/products/TR1168_1_electronic_stopwatch.png',
    'https://truir-eng.github.io/gztruit/products/TR1168_2_mechanical_stopwatch.png',
  ];

  for (const img of images) {
    await checkImage(img);
  }
}

main().catch(console.error);
