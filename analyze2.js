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
  
  // Find language switch script
  const scripts = body.match(/<script>[\s\S]*?<\/script>/g) || [];
  console.log('Total script blocks:', scripts.length);
  
  scripts.forEach((s, i) => {
    if (s.toLowerCase().includes('switchlang') || s.toLowerCase().includes('translations') || s.toLowerCase().includes('lang')) {
      console.log(`\nScript ${i} (${s.length} chars):`);
      console.log(s.substring(0, 800));
    }
  });
  
  // Check for download buttons - look for href with docx/pdf
  const dlMatches = body.match(/href="[^"]*\.(docx?|pdf)"[^>]*>[^<]*</g);
  if (dlMatches) {
    console.log('\nDownload links:', dlMatches.slice(0, 5));
  }
  
  // Check QR code references  
  const qrRefs = body.match(/qr-[a-z]+[^"]*"*/g);
  console.log('\nQR refs:', qrRefs);
  
  // Check image sources
  const imgs = body.match(/<img[^>]+src="([^"]+)"/g) || [];
  console.log('\nImages:', imgs.slice(0, 5).map(i => i.substring(0, 100)));
}

main().catch(console.error);
