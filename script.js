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
const englishInputEl = document.getElementById('englishInput');
const outputEl = document.getElementById('output');
const copyBtn = document.getElementById('copyBtn');
const convertBtn = document.getElementById('convertBtn');
const translateBtn = document.getElementById('translateBtn');
const clearEnglishBtn = document.getElementById('clearEnglishBtn');
const sampleEnglishBtn = document.getElementById('sampleEnglishBtn');
const clearBtn = document.getElementById('clearBtn');
const sampleBtn = document.getElementById('sampleBtn');
const translationStatusEl = document.getElementById('translationStatus');
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

function setTranslationStatus(message, isError = false){
  translationStatusEl.textContent = message;
  translationStatusEl.classList.toggle('error', isError);
}

async function translateUsingGoogle(text){
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Google endpoint failed');
  }

  const data = await res.json();
  const translated = (data?.[0] || [])
    .map((chunk) => chunk?.[0] || '')
    .join('')
    .trim();

  if (!translated) {
    throw new Error('Google response was empty');
  }

  return translated;
}

async function translateUsingMyMemory(text){
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|hi`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('MyMemory endpoint failed');
  }

  const data = await res.json();
  const translated = (data?.responseData?.translatedText || '').trim();
  if (!translated) {
    throw new Error('MyMemory response was empty');
  }

  return translated;
}

async function translateEnglishToHindi(text){
  try {
    return await translateUsingGoogle(text);
  } catch (_) {
    return translateUsingMyMemory(text);
  }
}

async function translateAndConvert(){
  const englishText = (englishInputEl.value || '').trim();
  if (!englishText) {
    setTranslationStatus('Enter English text first.', true);
    englishInputEl.focus();
    return;
  }

  translateBtn.disabled = true;
  setTranslationStatus('Translating English to Hindi...');

  try {
    const hindiText = await translateEnglishToHindi(englishText);

    const normalizedEnglish = englishText.toLowerCase();
    const normalizedHindi = hindiText.toLowerCase();
    const hasDevanagari = /[\u0900-\u097F]/.test(hindiText);
    if (normalizedEnglish === normalizedHindi || !hasDevanagari) {
      inputEl.value = hindiText;
      outputEl.textContent = '';
      setTranslationStatus('Could not confidently translate this text to Hindi. Try meaningful English words/sentence.', true);
      return;
    }

    inputEl.value = hindiText;
    doConvert();
    setTranslationStatus('Translated and converted to Tirhuta.');
  } catch (err) {
    setTranslationStatus('Translation failed. Paste Hindi text in Step 2 and click Convert.', true);
  } finally {
    translateBtn.disabled = false;
  }
}

convertBtn.addEventListener('click', doConvert);
translateBtn.addEventListener('click', translateAndConvert);

clearEnglishBtn.addEventListener('click', () => {
  englishInputEl.value = '';
  setTranslationStatus('');
  englishInputEl.focus();
});

sampleEnglishBtn.addEventListener('click', () => {
  englishInputEl.value =
`What is your name?
My name is...
Is everything fine?
I am good.
What are you doing?
Please forgive me.
Do you speak Maithili?
Do you love me?
I love you.
I am 20 years old.`;
  setTranslationStatus('');
  englishInputEl.focus();
});

clearBtn.addEventListener('click', () => {
  englishInputEl.value = '';
  inputEl.value = '';
  setTranslationStatus('');
  doConvert();
  englishInputEl.focus();
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
  inputEl.focus();
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

englishInputEl.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
    translateAndConvert();
  }
});
