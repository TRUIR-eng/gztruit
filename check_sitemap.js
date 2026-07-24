const https = require('https');
const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request(url, { method: 'HEAD' }, (r) => {
      console.log(`${url} => ${r.statusCode}`);
      resolve(r.statusCode);
    });
    req.on('error', (e) => {
      console.log(`${url} => ERROR: ${e.message}`);
      resolve(0);
    });
    req.end();
  });
}

async function main() {
  // Check main site
  await checkUrl('https://truir-eng.github.io/gztruit/');
  await checkUrl('https://truir-eng.github.io/gztruit/index.html');
  await checkUrl('https://truir-eng.github.io/gztruit/products.html');
  await checkUrl('https://truir-eng.github.io/gztruit/sitemap.xml');
  
  // Check product pages
  const products = ['TR1001','TR1101','TR1168','TR2001','TR3001','TR4001','TR5001','TR5202','TR5206','TR5310','TR5312','TR5401','TR5402','TR6001','TR6002','TR7001','TR7002'];
  for (const p of products.slice(0, 5)) {
    await checkUrl(`https://truir-eng.github.io/gztruit/product.html?model=${p}`);
  }
}
main();
