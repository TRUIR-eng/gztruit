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
  const { body } = await fetch('https://truir-eng.github.io/gztruit/product.html?model=TR1001');
  
  // Check 1: Language switcher
  console.log('=== Language Switcher ===');
  console.log('lang-select:', body.includes('lang-select'));
  console.log('switchLang:', body.includes('switchLang'));
  console.log('translations:', body.includes('translations'));
  console.log('LANG:', body.includes('LANG'));
  
  // Check 2: Download buttons
  console.log('\n=== Download Buttons ===');
  const dlMatches = body.match(/download-btn[^>]*>[\s\S.{0,100}]*/g);
  if (dlMatches) {
    dlMatches.slice(0, 3).forEach(m => console.log(m.substring(0, 150)));
  }
  
  // Check 3: QR code section
  console.log('\n=== QR Codes ===');
  console.log('qr-wechat:', body.includes('qr-wechat'));
  console.log('qr-sales:', body.includes('qr-sales'));
  
  // Check 4: Product data (PRODUCTS constant)
  console.log('\n=== Product Data ===');
  const pMatch = body.match(/PRODUCTS\s*=\s*(\[[\s\S]{50,5000}\]);/);
  if (pMatch) {
    console.log('PRODUCTS found, length:', pMatch[1].length);
    // Show first product
    const firstProd = pMatch[1].match(/\{[^}]+\}/);
    if (firstProd) console.log('First product sample:', firstProd[0].substring(0, 200));
  } else {
    console.log('PRODUCTS not found, checking other patterns...');
    const alt = body.match(/var PRODUCTS[\s\S]{100}/);
    if (alt) console.log('Found var PRODUCTS');
  }
  
  // Check 5: CE/ISO badges
  console.log('\n=== Badges ===');
  console.log('CE badge:', body.includes('CE') || body.includes('ce-badge'));
  console.log('ISO badge:', body.includes('ISO') || body.includes('iso-badge'));
  
  // Check 6: Footer contact
  console.log('\n=== Contact Info ===');
  console.log('gztruit.com:', body.includes('gztruit.com'));
  console.log('020-31706520:', body.includes('020-31706520'));
}

main().catch(console.error);
