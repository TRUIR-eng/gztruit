const https = require('https');

function fetchUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', (e) => resolve({ status: 0, body: '', error: e.message }));
  });
}

async function main() {
  // Check product.html
  const r1 = await fetchUrl('https://truir-eng.github.io/gztruit/product.html?model=TR1001');
  console.log('product.html Status:', r1.status, 'Size:', r1.body.length);
  
  if (r1.body.length > 1000) {
    // Extract product data
    const prodsMatch = r1.body.match(/const PRODUCTS\s*=\s*(\[[\s\S]+?\]);/);
    if (prodsMatch) {
      console.log('PRODUCTS data found, length:', prodsMatch[1].length);
    } else {
      // Try other patterns
      const prodMatch = r1.body.match(/PRODUCTS\s*=\s*\{[\s\S]+?\}/);
      if (prodMatch) console.log('PRODUCTS object found');
    }
    
    // Check what language support exists
    const hasLang = r1.body.includes('translations') || r1.body.includes('langObj');
    console.log('Has language support:', hasLang);
    
    // Check for download buttons
    const hasDown = r1.body.includes('download-btn') || r1.body.includes('downloadWord');
    console.log('Has download buttons:', hasDown);
    
    // Extract first 500 chars after <body
    const bodyMatch = r1.body.match(/<body[\s\S]{0,500}/);
    if (bodyMatch) console.log('Body start:', bodyMatch[0].substring(0, 200));
  }
  
  // Check products TR1001 image
  const r2 = await fetchUrl('https://truir-eng.github.io/gztruit/products/TR1001_1.jpg');
  console.log('\nTR1001_1.jpg Status:', r2.status, 'Size:', r2.body.length);
  if (r2.body.length > 0 && r2.body.length < 1000) {
    console.log('Small file (likely 404 page):', r2.body.substring(0, 200));
  }
  
  // Check sitemap
  const r3 = await fetchUrl('https://truir-eng.github.io/gztruit/sitemap.xml');
  console.log('\nsitemap.xml Status:', r3.status, 'Size:', r3.body.length);
  if (r3.status === 200 && r3.body.includes('<?xml')) {
    console.log('Valid XML sitemap!');
  }
}

main().catch(console.error);
