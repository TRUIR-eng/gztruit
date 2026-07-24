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
  
  // Find the main <script> block content - look for key patterns
  const scripts = body.match(/<script>([\s\S]+?)<\/script>/g);
  console.log('Script blocks found:', scripts ? scripts.length : 0);
  
  // Find which script has the translations
  if (scripts) {
    scripts.forEach((s, i) => {
      if (s.includes('translations') || s.includes('LANG') || s.includes('const lang')) {
        console.log(`\nScript ${i} has translations (${s.length} chars):`);
        console.log(s.substring(0, 500));
      }
    });
  }
  
  // Find products data
  const prodMatch = body.match(/PRODUCTS\s*[\s\S]{5,3000}");
  if (prodMatch) {
    console.log('\nPRODUCTS data found');
    console.log(prodMatch[0].substring(0, 500));
  } else {
    // Look for any array/object that might be product data
    const arrMatch = body.match(/var\s+\w+\s*=\s*\[[\s\S]{100,5000}\]/);
    if (arrMatch) {
      console.log('\nFound array vars:', arrMatch[0].substring(0, 300));
    }
  }
  
  // Look for the language switch function
  const langFunc = body.match(/switchLang[\s\S]{200}");
  if (langFunc) {
    console.log('\nswitchLang function:');
    console.log(langFunc[0].substring(0, 400));
  }
  
  // Check if QR code images are referenced
  const qrMatches = body.match(/qr-[a-z-]+(?:png|jpg|jpeg)/g);
  console.log('\nQR images found:', qrMatches);
  
  // Check download buttons href
  const dlHrefs = body.match(/href="[^"]*\.(docx?|pdf)"/g);
  if (dlHrefs) {
    console.log('\nDownload hrefs:', dlHrefs.slice(0, 5));
  }
  
  // Show key sections of body
  console.log('\n=== Key HTML sections ===');
  console.log('Has hero section:', body.includes('class="hero'));
  console.log('Has product gallery:', body.includes('product-gallery') || body.includes('gallery'));
  console.log('Has specs table:', body.includes('specs') || body.includes('参数'));
  console.log('Has contact section:', body.includes('contact') || body.includes('联系方式'));
  
  // Check if it's using product introduction files from products/ folder
  console.log('\n=== Products folder references ===');
  const prodFolderRefs = body.match(/products\/[^\s"']+/g);
  console.log('References to products/ folder:', prodFolderRefs);
}

main().catch(console.error);
