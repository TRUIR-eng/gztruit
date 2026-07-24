const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        console.log(`[${url.split('=')[1] || url.split('/').pop()}] Status: ${res.statusCode} | Size: ${d.length}`);
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log(`[${url}] ERROR: ${e.message}`);
      resolve();
    });
  });
}

async function main() {
    const pages = [
      'https://truir-eng.github.io/gztruit/',
      'https://truir-eng.github.io/gztruit/index.html',
      'https://truir-eng.github.io/gztruit/products.html',
      'https://truir-eng.github.io/gztruit/sitemap.xml',
      'https://truir-eng.github.io/gztruit/product.html?model=TR1001',
      'https://truir-eng.github.io/gztruit/product.html?model=TR1101',
      'https://truir-eng.github.io/gztruit/product.html?model=TR1168',
      'https://truir-eng.github.io/gztruit/product.html?model=TR5202',
      'https://truir-eng.github.io/gztruit/product.html?model=TR5312',
    ];
    
    for (const url of pages) {
      await checkUrl(url);
    }
    
    // Check product images
    const images = [
      'https://truir-eng.github.io/gztruit/products/TR1001_1.jpg',
      'https://truir-eng.github.io/gztruit/products/TR1001_2.jpg',
      'https://truir-eng.github.io/gztruit/products/TR1168_1_electronic_stopwatch.png',
      'https://truir-eng.github.io/gztruit/products/TR1168_2_mechanical_stopwatch.png',
      'https://truir-eng.github.io/gztruit/products/TR5202_F1_impact_tester.jpeg',
    ];
    
    console.log('\n--- Product Images ---');
    for (const img of images) {
      await checkUrl(img);
    }
  }

main().catch(console.error);
