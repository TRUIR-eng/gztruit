const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', () => resolve({ status: 0, body: '' }));
  });
}

async function main() {
  // 1. Check sitemap
  console.log('=== sitemap.xml ===');
  const sm = await fetch('https://truir-eng.github.io/gztruit/sitemap.xml');
  console.log('Status:', sm.status, '| Valid XML:', sm.body.includes('<?xml'));
  
  // 2. Check all 17 product pages
  console.log('\n=== All 17 Product Pages ===');
  const models = ['TR1001','TR1101','TR1168','TR2001','TR3001','TR4001','TR5001','TR5202','TR5206','TR5310','TR5312','TR5401','TR5402','TR6001','TR6002','TR7001','TR7002'];
  let failCount = 0;
  for (const m of models) {
    const r = await fetch('https://truir-eng.github.io/gztruit/product.html?model=' + m);
    if (r.status !== 200) { console.log('FAIL: ' + m, r.status); failCount++; }
  }
  console.log(failCount === 0 ? 'All 17 pages: 200 OK ✅' : `${failCount} pages failed`);
  
  // 3. Check language switcher on product page
  console.log('\n=== Language Switcher ===');
  const ph = await fetch('https://truir-eng.github.io/gztruit/product.html?model=TR1001');
  console.log('Has lang-select:', ph.body.includes('lang-select'));
  console.log('Has switchLang function:', ph.body.includes('function switchLang'));
  console.log('Has allProducts (multi-lang):', ph.body.includes('allProducts'));
  
  // 4. Check products.html filter dropdowns
  console.log('\n=== products.html Filter Dropdowns ===');
  const psh = await fetch('https://truir-eng.github.io/gztruit/products.html');
  console.log('Has category-select:', psh.body.includes('category-select'));
  console.log('Has subcat-select:', psh.body.includes('subcat-select'));
  console.log('Has两级下拉:', psh.body.includes('SUBCATS'));
  
  // 5. Check index.html filter dropdowns
  console.log('\n=== index.html Filter Dropdowns ===');
  const ih = await fetch('https://truir-eng.github.io/gztruit/index.html');
  console.log('Has category-select:', ih.body.includes('category-select'));
  console.log('Has idxSetCategory:', ih.body.includes('idxSetCategory'));
  console.log('Has SUBCATS:', ih.body.includes('SUBCATS'));
  
  // 6. Check product images in products folder
  console.log('\n=== Product Images in products/ ===');
  const imgModels = ['TR1001','TR1101','TR1168','TR5202','TR5206'];
  for (const m of imgModels) {
    const exts = ['.jpg','.jpeg','.png'];
    for (const ext of exts) {
      const r = await fetch('https://truir-eng.github.io/gztruit/products/' + m + '_1' + ext);
      console.log(`${m}_1${ext}: ${r.status}${r.status !== 200 ? ' ❌' : r.body.length < 1000 ? ' (small/404)' : ' ✅'}`);
    }
  }
}

main().catch(console.error);
