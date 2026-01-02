const DEV_TO_TIR = {
  "अ":"𑒁","आ":"𑒂","इ":"𑒃","ई":"𑒄","उ":"𑒅","ऊ":"𑒆",
  "ऋ":"𑒇","ॠ":"𑒈","ऌ":"𑒉","ॡ":"𑒊",
  "ए":"𑒋","ऐ":"𑒌","ओ":"𑒍","औ":"𑒎",

  "क":"𑒏","ख":"𑒐","ग":"𑒑","घ":"𑒒","ङ":"𑒓",
  "च":"𑒔","छ":"𑒕","ज":"𑒖","झ":"𑒗","ञ":"𑒘",
  "ट":"𑒙","ठ":"𑒚","ड":"𑒛","ढ":"𑒜","ण":"𑒝",
  "त":"𑒞","थ":"𑒟","द":"𑒠","ध":"𑒡","न":"𑒢",
  "प":"𑒣","फ":"𑒤","ब":"𑒥","भ":"𑒦","म":"𑒧",
  "य":"𑒨","र":"𑒩","ल":"𑒪","व":"𑒫",
  "श":"𑒬","ष":"𑒭","स":"𑒮","ह":"𑒯",

  "ा":"𑒰","ि":"𑒱","ी":"𑒲","ु":"𑒳","ू":"𑒴",
  "ृ":"𑒵","ॄ":"𑒶","े":"𑒹","ै":"𑒻","ो":"𑒼","ौ":"𑒾",

  "्":"𑓂","ँ":"𑒿","ं":"𑓀","ः":"𑓁",

  "०":"𑓐","१":"𑓑","२":"𑓒","३":"𑓓","४":"𑓔",
  "५":"𑓕","६":"𑓖","७":"𑓗","८":"𑓘","९":"𑓙",

  " ":" ","।":"।","॥":"॥","\n":"\n"
};

const inputEl = document.getElementById('input');
const outputEl = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const convertBtn = document.getElementById('convertBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const toast = document.getElementById('toast');

function transliterate(text){
  let out = '';
  for (const ch of text){
    out += DEV_TO_TIR[ch] ?? ch;
  }
  return out;
}

function doConvert(){
  const value = inputEl.value || '';
  const tir = transliterate(value);
  outputEl.textContent = tir;
}

convertBtn.addEventListener('click', doConvert);

clearBtn.addEventListener('click', () => {
  inputEl.value = '';
  doConvert();
  inputEl.focus();
});

sampleBtn.addEventListener('click', () => {
  inputEl.value =
`अहांक नाम की छी?
हमर नाम छी...
सभ कुशल मंगल?
हम नीक छी
अहां की कए रहल छी?
हमरा माफ क दिय
की अहाँ मैथिली बजैत छी
की अहाँ हमरा सँ प्रेम करे छी?
हम अहां सँ प्रेम करै छी
हम २० वर्षक छी`;
  doConvert();
});


async function copyOutput(){
  const text = outputEl.textContent || '';
  if (!text.trim()){
    outputEl.animate([{boxShadow:'0 0 0 rgba(0,0,0,0)'},{boxShadow:'0 0 12px rgba(139,30,30,0.35)'}],{duration:300});
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 1600);
  } catch (err){
    alert('Copy failed — you can select the text and copy manually.');
  }
}


copyBtn.addEventListener('click', copyOutput);

inputEl.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
    doConvert();
  }
});
