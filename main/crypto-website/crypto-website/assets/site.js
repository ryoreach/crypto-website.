
// Utility: normalize modulo
function mod(n, m) { return ((n % m) + m) % m; }

// Caesar / Shift
function caesar(text, shift) {
  const A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);
  const a = 'a'.charCodeAt(0), z = 'z'.charCodeAt(0);
  const s = mod(shift, 26);
  let out = '';
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= A && code <= Z) out += String.fromCharCode(A + mod(code - A + s, 26));
    else if (code >= a && code <= z) out += String.fromCharCode(a + mod(code - a + s, 26));
    else out += ch;
  }
  return out;
}

// Affine cipher: E(x) = (a*x + b) mod 26; a must be coprime to 26
function gcd(x, y){ while(y){ [x,y] = [y, x % y]; } return Math.abs(x); }
function egcd(a, b){ if(b===0) return [a,1,0]; const [g,x1,y1] = egcd(b, a % b); return [g, y1, x1 - Math.floor(a/b)*y1]; }
function modInverse(a, m){ const [g,x] = egcd(mod(a,m), m); if(g !== 1) return null; return mod(x, m); }
function affineEncrypt(text, a, b){
  let out='';
  const A='A'.charCodeAt(0), aCode='a'.charCodeAt(0);
  for(const ch of text){
    const code = ch.charCodeAt(0);
    if(code>=65 && code<=90){ out += String.fromCharCode(A + mod(a*(code-A)+b,26)); }
    else if(code>=97 && code<=122){ out += String.fromCharCode(aCode + mod(a*(code-aCode)+b,26)); }
    else out += ch;
  }
  return out;
}
function affineDecrypt(text, a, b){
  const aInv = modInverse(a,26); if(aInv===null) return null;
  let out='';
  const A='A'.charCodeAt(0), aCode='a'.charCodeAt(0);
  for(const ch of text){
    const code = ch.charCodeAt(0);
    if(code>=65 && code<=90){ out += String.fromCharCode(A + mod(aInv*(code-A - b),26)); }
    else if(code>=97 && code<=122){ out += String.fromCharCode(aCode + mod(aInv*(code-aCode - b),26)); }
    else out += ch;
  }
  return out;
}

// Simple Columnar Transposition (educational)
function columnarEncrypt(plaintext, key){
  // remove spaces? keep as is for demo
  const cols = key.length; if(cols===0) return plaintext;
  const rows = Math.ceil(plaintext.length / cols);
  const grid = Array.from({length: rows}, (_, r) => plaintext.slice(r*cols, (r+1)*cols).padEnd(cols, '•'));
  // sort key positions by alphabetical order
  const order = [...key].map((ch,i)=>({ch,i})).sort((a,b)=> a.ch.localeCompare(b.ch) || a.i-b.i).map(o=>o.i);
  let cipher='';
  for(const idx of order){ for(let r=0;r<rows;r++){ cipher += grid[r][idx]; } }
  return cipher;
}
function columnarDecrypt(ciphertext, key){
  const cols = key.length; if(cols===0) return ciphertext;
  const rows = Math.ceil(ciphertext.length / cols);
  const order = [...key].map((ch,i)=>({ch,i})).sort((a,b)=> a.ch.localeCompare(b.ch) || a.i-b.i).map(o=>o.i);
  const grid = Array.from({length: rows}, ()=> Array(cols).fill('•'));
  let idx=0;
  for(const col of order){ for(let r=0;r<rows;r++){ grid[r][col] = ciphertext[idx++] || '•'; } }
  let plain='';
  for(let r=0;r<rows;r++){ plain += grid[r].join(''); }
  return plain.replace(/•+$/,'');
}

// RSA demo (small primes; purely educational)
function isPrime(n){ if(n<2) return false; if(n%2===0) return n===2; for(let i=3;i*i<=n;i+=2){ if(n%i===0) return false; } return true; }
function phi(n){ // not general; used with n=p*q
  return n; }
function rsaKey(p, q, e){
  const n = p*q;
  const phiN = (p-1)*(q-1);
  // pick e if not given
  let E = e || 65537; // common choice
  if(gcd(E, phiN) !== 1){
    // find a small coprime
    for(let cand=3;cand<phiN;cand+=2){ if(gcd(cand, phiN)===1){ E=cand; break; } }
  }
  const d = modInverse(E, phiN);
  return { n, phiN, e:E, d };
}
function rsaEncrypt(m, e, n){ return BigInt(m) ** BigInt(e) % BigInt(n); }
function rsaDecrypt(c, d, n){ return BigInt(c) ** BigInt(d) % BigInt(n); }

// Helpers for pages
function byId(id){ return document.getElementById(id); }
function setText(id, text){ byId(id).textContent = text; }
function setValue(id, val){ byId(id).value = val; }
