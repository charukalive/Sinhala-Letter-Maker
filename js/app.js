// Sinhala Font & Letter Studio Application Controller
(function() {
  'use strict';

  // DOM Elements - Converter
  const inputText = document.getElementById('inputText');
  const outputText = document.getElementById('outputText');
  const previewBox = document.getElementById('previewBox');
  const fontSelect = document.getElementById('fontSelect');
  const fontSizeRange = document.getElementById('fontSizeRange');
  const fontSizeVal = document.getElementById('fontSizeVal');
  const previewFontLabel = document.getElementById('previewFontLabel');

  const inputLabel = document.getElementById('inputLabel');
  const outputLabel = document.getElementById('outputLabel');
  const inCharCount = document.getElementById('inCharCount');
  const inWordCount = document.getElementById('inWordCount');
  const outCharCount = document.getElementById('outCharCount');
  const outWordCount = document.getElementById('outWordCount');
  const enDetectedBadge = document.getElementById('enDetectedBadge');
  const chkPreserveEnglish = document.getElementById('chkPreserveEnglish');
  const chkHighlightEnglish = document.getElementById('chkHighlightEnglish');

  const tabBtns = document.querySelectorAll('.tab-btn');
  const btnSwapMode = document.getElementById('btnSwapMode');
  const btnCopy = document.getElementById('btnCopy');
  const btnCopyWord = document.getElementById('btnCopyWord');
  const btnClear = document.getElementById('btnClear');
  const btnPaste = document.getElementById('btnPaste');
  const btnLoadComplaint = document.getElementById('btnLoadComplaint');
  const btnExportDocx = document.getElementById('btnExportDocx');
  const btnExportDoc = document.getElementById('btnExportDoc');
  const btnPrint = document.getElementById('btnPrint');

  // DOM Elements - Views & Letter Studio
  const viewBtnConverter = document.getElementById('viewBtnConverter');
  const viewBtnLetter = document.getElementById('viewBtnLetter');
  const converterView = document.getElementById('converterView');
  const letterStudioView = document.getElementById('letterStudioView');

  const selLetterhead = document.getElementById('selLetterhead');
  const selLetterFont = document.getElementById('selLetterFont');
  const letterBodyRendered = document.getElementById('letterBodyRendered');
  const letterHeaderBanner = document.getElementById('letterHeaderBanner');
  const letterFooterBanner = document.getElementById('letterFooterBanner');
  const letterHeadTitle = document.getElementById('letterHeadTitle');
  const letterHeadSub = document.getElementById('letterHeadSub');
  const footEmail = document.getElementById('footEmail');
  const footPhone = document.getElementById('footPhone');
  const footAddress = document.getElementById('footAddress');

  const btnLetterPrint = document.getElementById('btnLetterPrint');
  const btnLetterDocx = document.getElementById('btnLetterDocx');
  const btnLetterDoc = document.getElementById('btnLetterDoc');

  // DOM Elements - Letter Ending (signatures / copies / annexures)
  const printableA4Page = document.getElementById('printableA4Page');
  const letterheadBg = document.getElementById('letterheadBg');
  const letterheadHeader = document.getElementById('letterheadHeader');
  const letterheadFooter = document.getElementById('letterheadFooter');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const zoomValue = document.getElementById('zoomValue');
  let previewZoom = 1;
  const letterSignatures = document.getElementById('letterSignatures');
  const letterCopies = document.getElementById('letterCopies');
  const letterTrailing = document.getElementById('letterTrailing');
  const letterAnnexures = document.getElementById('letterAnnexures');
  const exactPreview = document.getElementById('exactPreview');
  const btnViewEdit = document.getElementById('btnViewEdit');
  const btnViewExact = document.getElementById('btnViewExact');
  let previewView = 'edit'; // 'edit' | 'exact'
  const sigCheckboxes = document.getElementById('sigCheckboxes');
  const copiesText = document.getElementById('copiesText');
  const annexInput = document.getElementById('annexInput');
  const annexList = document.getElementById('annexList');

  // AWC signatories: signature images extracted from Hugo's own letter
  // (16th October 2026 Letter to Min of Environment .docx), in the
  // letter's 2-column grid order. Org line is the same for all.
  const AWC_ORG_LINE = 'සත්ව සුබසාධන සංසදය';
  let SIGNATORIES = [
    { id: 'gihan', nameSi: 'ගිහාන් දිනුෂ්ක', nameEn: 'Gihan Dinushka', img: 'assets/signatures/gihan-dinushka.jpg', w: 389, h: 194 },
    { id: 'chamith', nameSi: 'වෛද්‍ය චමිත් නානායක්කාර', nameEn: 'Dr Chamith Nanayakkara', img: 'assets/signatures/chamith-nanayakkara.jpg', w: 246, h: 204 },
    { id: 'thilini', nameSi: 'තිලිනි ගමගේ', nameEn: 'Thilini Gamage', img: 'assets/signatures/thilini-gamage.jpg', w: 602, h: 261 },
    { id: 'charuka', nameSi: 'චාරුක වික්‍රමසේකර', nameEn: 'Charuka Wickramasekara', img: 'assets/signatures/charuka-wickramasekara.png', w: 214, h: 91 },
    { id: 'mihiri', nameSi: 'මිහිරි සිරිවර්ධන', nameEn: 'Mihiri Siriwardena', img: 'assets/signatures/mihiri-siriwardena.png', w: 176, h: 55 },
    { id: 'aravinda', nameSi: 'අරවින්ද ප්‍රනාන්දු', nameEn: 'Aravinda Fernando', img: 'assets/signatures/aravinda-fernando.jpg', w: 489, h: 173 }
  ];

  // Annexure images added by the user: { name, dataUrl, ext, w, h }
  let annexures = [];

  // Letter formatting state (Letter Studio)
  const selLetterSize = document.getElementById('selLetterSize');
  const btnCopyLetter = document.getElementById('btnCopyLetter');
  const newSigNameSi = document.getElementById('newSigNameSi');
  const newSigNameEn = document.getElementById('newSigNameEn');
  const newSigFile = document.getElementById('newSigFile');
  const btnAddSig = document.getElementById('btnAddSig');
  let letterAlign = 'both'; // 'both' | 'left' | 'center' | 'right'
  let letterSizePt = 12;

  // Custom signatures are stored on this device only (localStorage)
  function loadCustomSignatures() {
    try {
      const saved = JSON.parse(localStorage.getItem('awc_custom_signatures') || '[]');
      if (Array.isArray(saved)) {
        saved.forEach(s => { if (s && s.img && s.nameSi) SIGNATORIES.push(s); });
      }
    } catch (e) { /* ignore */ }
  }

  function saveCustomSignatures() {
    try {
      localStorage.setItem('awc_custom_signatures', JSON.stringify(SIGNATORIES.filter(s => s.custom)));
    } catch (e) { /* storage full/blocked: signature still works this session */ }
  }

  // Theme & Modal
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const btnCheatSheet = document.getElementById('btnCheatSheet');
  const cheatModal = document.getElementById('cheatModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const toastContainer = document.getElementById('toastContainer');

  // Default font configuration: 4u-Bindumathi default
  let currentMode = 'u2fm'; // Default mode: Unicode -> 4u / FM fonts
  let lastRichHtml = '';
  let lastEnglishTokens = [];

  const sampleComplaintLetter = `2026 නොවැම්බර් 10

ස්ථානාධිපති,
පොලිස් ස්ථානය,
කැලණිය.

ගරු ස්ථානාධිපතිතුමනි,

ඓතිහාසික කැලණි රජමහා විහාර පරිශ්‍රයේ වෙසෙන ප්‍රජා සුනඛයින් පිරිසක් කුඩා ලොරි රථයකින් (LF-6345) බලහත්කාරයෙන් පැහැරගෙන ගොස් අතුරුදහන් කිරීම, ජලභීතිකා මර්දන හා සත්ව හිංසා නීති අමු අමුවේ උල්ලංඝනය කිරීම සහ සාක්ෂිකාරියකට සාපරාධී ලෙස තර්ජනය කිරීම පිළිබඳ නිල පැමිණිල්ල.

දොඩන්දුව, පින්කන්ද, තීරණගම පාර ලිපිනයේ පදිංචි චාන්දනී කාරියවසම් මහත්මිය (දුරකථන: 077 278 2207) විසින් සත්ව සුබසාධන සංසදය (AWC) වෙත ලිඛිතව ඉදිරිපත් කරන ලද පැමිණිල්ලකට සහ ඡායාරූපමය සාක්ෂිවලට අදාළව, කඩිනම් හා දැඩි පොලිස් විමර්ශනයක් අපේක්ෂාවෙන් මෙම නිල පැමිණිල්ල ඔබතුමා වෙත යොමු කරමු.

1. සිදුවීමට අදාළ මූලික කරුණු:

▪ 2026 නොවැම්බර් මස 09 වන දින දහවල් 12. 30 ට පමණ, කැලණි රජමහා විහාර පරිශ්‍රයේ වෙසෙන ප්‍රජා සුනඛයින් පිරිසක් සංවිධානාත්මක කණ්ඩායමක් විසින් බලහත්කාරයෙන් අල්ලාගෙන විහාර පරිශ්‍රයෙන් පිටතට රැගෙන ගොස් කුඩා ලොරි රථයකට පටවන ආකාරය පැමිණිලිකාරිය වන චාන්දනී කාරියවසම් මහත්මිය විසින් ඇසින් දැක ඇත.

▪ මෙම නීතිවිරෝධී ක්‍රියාව තම ජංගම දුරකථනයෙන් ඡායාරූපගත කිරීමට යාමේදී, සතුන් පටවමින් සිටි පුද්ගලයින් ඉතා සාහසික හා ආක්‍රමණශීලී අයුරින් ඇයට ප්‍රසිද්ධියේ බැන වැදී, සාක්ෂි ලබාගැනීම වැළැක්වීමේ අරමුණින් සාපරාධී ලෙස බිය ගන්වා තර්ජනය කර ඇත.

▪ ඒ හේතුවෙන් දැඩි භීතියට පත් වූ ඇයට ලබා ගැනීමට හැකිව ඇත්තේ අදාළ රථය පිටව යන අයුරු දැක්වෙන ඡායාරූප දෙකක් (02) පමණි.

2. තාක්ෂණික හා ඩිජිටල් සාක්ෂි විශ්ලේෂණය (Reverse Engineering Analysis):

පැමිණිලිකාරිය විසින් මෙම ඡායාරූප ලබාගෙන ඇත්තේ Nubia 70 මාදිලියේ ජංගම දුරකථනයකින් වන අතර, එහි ඇති AI Upscaling තාක්ෂණය නිසා දුරස්ථව ගත් ඡායාරූපයේ අංක තහඩුවේ අකුරු තරමක් බොඳ වී (Blur) තිබිණි. එහෙත් අප සංවිධානයේ තාක්ෂණික කණ්ඩායම විසින් ඩිජිටල් Reverse Engineering තාක්ෂණය භාවිත කරමින් එම අංක රටාවන් සහ රූපරාමු මෝටර් රථ ප්‍රවාහන දෙපාර්තමේන්තුවේ (DMT) දත්ත පද්ධතිය සමඟ ගැළපීමේදී, අදාළ කළු පැහැති කැනොපි ආවරණය සහිත සුදු පැහැති TATA ACE ලොරි රථයට සමපාත වන එකම ලියාපදිංචි රථය මෙසේ තහවුරු කර ගන්නා ලදී.

▪ වාහන ලියාපදිංචි අංකය: LF-6345
▪ වාහන පන්තිය සහ මාදිලිය: MOTOR LORRY - TATA ACE (නිෂ්පාදිත වර්ෂය: 2008)
▪ එන්ජින් අංකය: 275IDI05ERZS22345
▪ ලියාපදිංචි නිරපේක්ෂ අයිතිය: MATARA DISTRICT CAPITAL COOPERATIVE SOCIETY LTD

3. නීතිමය පසුබිම:

අ.) 1893 අංක 07 දරන ජලභීතිකා ආඥාපනත (Rabies Ordinance), ජාතික ජලභීතිකා මර්දන ප්‍රතිපත්තිය සහ යෝජිත 2026 සුනඛ ලියාපදිංචි කිරීමේ හා ජලභීතිකා පනත:
රජයේ නිල CNVR (Catch-Neuter-Vaccinate-Release) ප්‍රතිපත්තිය සහ යෝජිත 2026 පනතේ මූලිකාංග අමු අමුවේ උල්ලංඝනය කිරීමකි. කලාපයේ ඇති වන ශුන්‍යතාවයට (Vacuum Effect) පිටතින් ආගන්තුක සතුන් පැමිණීම සිදු වේ.

ආ.) 1907 අංක 13 දරන සත්ව හිංසා වැළැක්වීමේ ආඥාපනත
2(1)(a) සහ 2(1)(b) වගන්ති යටතේ සතුන් හිංසනයට ලක් වන පරිදි ප්‍රවාහනය කිරීම දඬුවම් ලැබිය හැකි වරදකි.

4. අපගේ ඉල්ලීම්:

▪ 2026.11.09 දින ආරක්ෂිත කැමරා (CCTV) දර්ශන මැකී යාමට පෙර වහාම පොලිස් භාරයට ගෙන පරීක්ෂා කරන ලෙස ඉල්ලා සිටිමු.
▪ LF-6345 දරන TATA ACE ලොරි රථය සහ එහි පැමිණි පිරිස වහාම කැඳවා ප්‍රශ්න කර නීතිය දැඩිව ක්‍රියාත්මක කරන ලෙස ඉල්ලා සිටිමු.

ස්තූතියි.
මෙයට විශ්වාසී,

සත්ව සුබසාධන සංසදය (AWC) වෙනුවෙන්:
ගිහාන් දිනුෂ්ක        වෛද්‍ය චමිත් නානායක්කාර
තිළිණි ගමගේ         චාරුක වික්‍රමසේකර
මිහිරි සිරිවර්ධන       අරවින්ද ප්‍රනාන්දු

පිටපත් (දැනගැනීම සහ අවශ්‍ය නෛතික ක්‍රියාමාර්ග සඳහා):
▪ ජනාධිපති ලේකම් කාර්යාලය
▪ පොලිස්පති තුමා, පොලිස් මූලස්ථානය, කොළඹ.
▪ ජ්‍යෙෂ්ඨ පොලිස් අධිකාරී තුමා (SSP), කැලණිය පොලිස් කොට්ඨාසය.
▪ අධ්‍යක්ෂ, මහජන සෞඛ්‍ය පශු වෛද්‍ය සේවා (PHVS), සෞඛ්‍ය අමාත්‍යාංශය.
▪ සභාපති තුමා / ලේකම් තුමා, ප්‍රාදේශීය සභාව - කැලණිය.
▪ සෞඛ්‍ය වෛද්‍ය නිලධාරී තුමා (MOH), කැලණිය.

ඇමිණුම්:
▪ සිදුවීමට අදාළ ඡායාරූප
▪ අදාළ ලොරි රථයේ විස්තර (DMT Report)`;

  // Toast Notification
  function showToast(msg, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span style="color: var(--accent-success); font-weight: bold;">${icon}</span> <span>${msg}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  // Helper: Get user's selected active font name
  function getSelectedFont(isLetterStudio = false) {
    if (isLetterStudio) {
      return selLetterFont.value || '4u-Bindumathi';
    }
    return fontSelect.value || '4u-Bindumathi';
  }

  // Update Stats Counters
  function updateStats() {
    const inVal = inputText.value;
    const outVal = outputText.value;

    inCharCount.textContent = `${inVal.length} chars`;
    inWordCount.textContent = `${inVal.trim() ? inVal.trim().split(/\s+/).length : 0} words`;

    outCharCount.textContent = `${outVal.length} chars`;
    outWordCount.textContent = `${outVal.trim() ? outVal.trim().split(/\s+/).length : 0} words`;

    if (lastEnglishTokens.length > 0 && chkPreserveEnglish.checked) {
      enDetectedBadge.style.display = 'inline-flex';
      enDetectedBadge.innerHTML = `🛡️ ${lastEnglishTokens.length} English terms preserved`;
    } else {
      enDetectedBadge.style.display = 'none';
    }
  }

  // Update English highlight class
  function updateEnglishHighlight() {
    const shouldHighlight = chkHighlightEnglish.checked;
    if (shouldHighlight) {
      previewBox.classList.add('highlight-english');
      letterBodyRendered.classList.add('highlight-english');
    } else {
      previewBox.classList.remove('highlight-english');
      letterBodyRendered.classList.remove('highlight-english');
    }
  }

  // Core Conversion Dispatcher
  function runConversion() {
    const val = inputText.value;
    const activeFont = getSelectedFont(false);

    if (!val) {
      outputText.value = '';
      previewBox.innerHTML = 'Your rendered Sinhala text with English words will appear here in real-time.';
      lastRichHtml = '';
      lastEnglishTokens = [];
      updateStats();
      updateLetterStudio();
      return;
    }

    const preserveEnglish = chkPreserveEnglish.checked;
    let plainResult = '';
    let richHtml = '';

    // Check if the current mode or selected font is Isi
    const isIsi = (currentMode === 'u2isi' || activeFont === 'IsiAbhaya');

    if (currentMode === 'u2fm' || currentMode === 'u2isi') {
      const targetType = isIsi ? 'isi' : 'fm';
      const convertFn = isIsi ? unicodeToIsi : unicodeToFM;

      if (preserveEnglish && window.MixedFontFormatter) {
        const res = window.MixedFontFormatter.convertWithPreservation(val, targetType, convertFn, activeFont);
        plainResult = res.plainText;
        richHtml = res.richHtml;
        lastEnglishTokens = res.englishTokens;
      } else {
        plainResult = convertFn(val);
        richHtml = escapeHtml(plainResult);
        lastEnglishTokens = [];
      }

      previewBox.style.fontFamily = `'${activeFont}', sans-serif`;
      previewBox.innerHTML = richHtml.replace(/\n/g, '<br>');
      previewFontLabel.textContent = activeFont;

    } else if (currentMode === 'fm2u') {
      plainResult = fmToUnicode(val);
      previewBox.style.fontFamily = "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif";
      previewBox.textContent = plainResult;
      richHtml = escapeHtml(plainResult);
      lastEnglishTokens = [];
      previewFontLabel.textContent = 'Iskoola Potha (Unicode)';

    } else if (currentMode === 'isi2u') {
      plainResult = isiToUnicode(val);
      previewBox.style.fontFamily = "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif";
      previewBox.textContent = plainResult;
      richHtml = escapeHtml(plainResult);
      lastEnglishTokens = [];
      previewFontLabel.textContent = 'Iskoola Potha (Unicode)';

    } else if (currentMode === 'singlish') {
      const unicodeResult = singlishToUnicode(val);
      const fmResult = unicodeToFM(unicodeResult);
      const isiResult = unicodeToIsi(unicodeResult);
      plainResult = `--- [Unicode Text] ---\n${unicodeResult}\n\n--- [${activeFont} Text] ---\n${isIsi ? isiResult : fmResult}`;
      previewBox.style.fontFamily = "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif";
      previewBox.textContent = unicodeResult;
      richHtml = escapeHtml(unicodeResult);
      lastEnglishTokens = [];
      previewFontLabel.textContent = 'Iskoola Potha (Unicode)';
    }

    outputText.value = plainResult;
    lastRichHtml = richHtml;
    updateStats();
    updateEnglishHighlight();
    updateLetterStudio();
  }

  // Split a typed copies / annexure-index section off the end of the
  // letter body, so it can be placed AFTER the signature grid (the
  // official order: body -> signatures -> copies -> annexure index).
  function splitTrailingSections(text) {
    const lines = (text || '').split(/\r?\n/);
    const marker = /^\s*(පිටපත්|ඇමිණුම්|ඇමුණුම|ඇමුණුම්|Copies\b|Annexures?\b|Annexure Index\b)/;
    const idx = lines.findIndex(l => marker.test(l));
    if (idx === -1) return { mainText: text, trailingText: '' };
    return {
      mainText: lines.slice(0, idx).join('\n').replace(/\s+$/, ''),
      trailingText: lines.slice(idx).join('\n')
    };
  }

  function renderTextToHtml(text) {
    const fontChoice = selLetterFont.value;
    if (fontChoice === 'unicode') return escapeHtml(text).replace(/\n/g, '<br>');
    const isIsi = (fontChoice === 'IsiAbhaya');
    const convertFn = isIsi ? unicodeToIsi : unicodeToFM;
    return window.MixedFontFormatter.convertWithPreservation(text, isIsi ? 'isi' : 'fm', convertFn, fontChoice).richHtml.replace(/\n/g, '<br>');
  }

  // Update Letter Studio Layout
  function updateLetterStudio() {
    const val = inputText.value || sampleComplaintLetter;
    const fontChoice = selLetterFont.value; // '4u-Bindumathi', 'FM-Malithi', 'FM-Abhaya', 'IsiAbhaya', 'unicode'

    const { mainText, trailingText } = splitTrailingSections(val);
    const fam = fontChoice === 'unicode'
      ? "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif"
      : `'${fontChoice}', sans-serif`;
    letterBodyRendered.style.fontFamily = fam;
    letterTrailing.style.fontFamily = fam;
    letterBodyRendered.innerHTML = renderTextToHtml(mainText);
    letterTrailing.innerHTML = trailingText.trim() ? renderTextToHtml(trailingText) : '';

    updateEnglishHighlight();
    updateLetterEnding();
  }

  // Convert a short Unicode string (signatory name, copies line, heading)
  // into rich HTML in the currently selected letter font, same as the body.
  function convertForLetter(unicodeText) {
    const fontChoice = selLetterFont.value;
    if (fontChoice === 'unicode') return escapeHtml(unicodeText);
    const isIsi = (fontChoice === 'IsiAbhaya');
    const convertFn = isIsi ? unicodeToIsi : unicodeToFM;
    return window.MixedFontFormatter.convertWithPreservation(unicodeText, isIsi ? 'isi' : 'fm', convertFn, fontChoice).richHtml;
  }

  function letterFontFamily() {
    const f = selLetterFont.value;
    return f === 'unicode' ? "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif" : `'${f}', sans-serif`;
  }

  function getSelectedSignatories() {
    return SIGNATORIES.filter(s => {
      const cb = document.getElementById('sigChk-' + s.id);
      return cb && cb.checked;
    });
  }

  function getCopiesLines() {
    return copiesText.value.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  }

  // Render signatures grid, copies list and annexure pages on the A4 page
  function updateLetterEnding() {
    const sigs = getSelectedSignatories();
    letterSignatures.style.fontFamily = letterFontFamily();
    if (sigs.length) {
      letterSignatures.innerHTML = '<div class="sig-grid">' + sigs.map(s => `
        <div class="sig-cell">
          <div class="sig-img-wrap"><img class="sig-img" src="${s.img}" alt=""></div>
          <div class="sig-line"></div>
          <div class="sig-org">${convertForLetter(AWC_ORG_LINE)}</div>
          <div class="sig-name">${convertForLetter(s.nameSi)}</div>
        </div>`).join('') + '</div>';
    } else {
      letterSignatures.innerHTML = '';
    }

    const copies = getCopiesLines();
    letterCopies.style.fontFamily = letterFontFamily();
    letterCopies.innerHTML = copies.length
      ? `<div class="copies-heading">${convertForLetter('පිටපත්:')}</div>` + copies.map((l, i) => `<div class="copies-line">${i + 1}. ${convertForLetter(l)}</div>`).join('')
      : '';

    letterAnnexures.style.fontFamily = letterFontFamily();
    letterAnnexures.innerHTML = annexures.map((a, i) => `
      <div class="annex-page">
        <div class="annex-heading">${convertForLetter('ඇමුණුම ' + String(i + 1).padStart(2, '0'))}</div>
        <img class="annex-img" src="${a.dataUrl}" alt="">
      </div>`).join('');

    if (previewView === 'exact') buildExactPreview();
  }

  function renderSigCheckboxes() {
    sigCheckboxes.innerHTML = SIGNATORIES.map(s => `
      <label class="sig-check-item">
        <input type="checkbox" id="sigChk-${s.id}" checked>
        <span>${escapeHtml(s.nameEn)}</span>
        ${s.custom ? `<button class="sig-remove" data-remove-sig="${s.id}" title="Remove this signature">✕</button>` : ''}
      </label>`).join('');
    SIGNATORIES.forEach(s => {
      document.getElementById('sigChk-' + s.id).addEventListener('change', updateLetterEnding);
    });
    sigCheckboxes.querySelectorAll('[data-remove-sig]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        SIGNATORIES = SIGNATORIES.filter(s => s.id !== btn.dataset.removeSig);
        saveCustomSignatures();
        renderSigCheckboxes();
        updateLetterEnding();
        showToast('Signature removed');
      });
    });
  }

  function renderAnnexList() {
    if (!annexures.length) {
      annexList.innerHTML = '<span class="annex-empty">No annexures added</span>';
      return;
    }
    annexList.innerHTML = annexures.map((a, i) => `
      <div class="annex-list-item">
        <span>ඇමුණුම ${String(i + 1).padStart(2, '0')} — ${escapeHtml(a.name)}</span>
        <button class="annex-remove" data-annex-idx="${i}" title="Remove">✕</button>
      </div>`).join('');
    annexList.querySelectorAll('.annex-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        annexures.splice(parseInt(btn.dataset.annexIdx, 10), 1);
        renderAnnexList();
        updateLetterEnding();
      });
    });
  }

  // --- Doc-editor style formatting for the letter body ---
  // The A4 letter body is contenteditable: Bold/Italic/Underline apply
  // to the current selection, alignment and size apply to the letter.
  function applyInlineFormat(command) {
    letterBodyRendered.focus();
    document.execCommand(command, false, null);
  }

  function setLetterAlign(align) {
    letterAlign = align;
    letterBodyRendered.style.textAlign = align === 'both' ? 'justify' : align;
    letterTrailing.style.textAlign = align === 'both' ? 'justify' : align;
    if (previewView === 'exact') buildExactPreview();
  }

  // Extract the (possibly formatted) letter body as lines of segments
  // for the DOCX builder. Preview spans already hold legacy-font text;
  // any raw Unicode Sinhala (e.g. pasted in) is converted here.
  function extractRichLines(rootEl = letterBodyRendered) {
    const fontChoice = selLetterFont.value;
    const isIsi = (fontChoice === 'IsiAbhaya');
    const convertFn = fontChoice === 'unicode' ? null : (isIsi ? unicodeToIsi : unicodeToFM);
    const lines = [];
    let cur = [];
    const flush = () => { lines.push(cur); cur = []; };
    function walk(node, flags, isRoot) {
      node.childNodes.forEach(ch => {
        if (ch.nodeType === 3) {
          let text = ch.nodeValue;
          if (!text) return;
          if (!flags.latin && convertFn && /[\u0D80-\u0DFF]/.test(text)) {
            text = convertFn(text);
          }
          cur.push({ text, bold: !!flags.bold, italic: !!flags.italic, underline: !!flags.underline, latin: !!flags.latin });
        } else if (ch.nodeType === 1) {
          const tag = ch.tagName;
          if (tag === 'BR') { flush(); return; }
          const f = { ...flags };
          if (tag === 'B' || tag === 'STRONG') f.bold = true;
          if (tag === 'I' || tag === 'EM') f.italic = true;
          if (tag === 'U') f.underline = true;
          if (ch.classList && ch.classList.contains('en-text')) f.latin = true;
          if (ch.classList && ch.classList.contains('si-text')) f.latin = false;
          const isBlock = (tag === 'DIV' || tag === 'P') && !isRoot;
          if (isBlock && cur.length) flush();
          walk(ch, f, false);
          if (isBlock && cur.length) flush();
        }
      });
    }
    walk(rootEl, { bold: false, italic: false, underline: false, latin: false }, true);
    flush();
    return lines;
  }

  // --- Exact A4 pagination engine ---
  // Measures the rendered letter content and packs it into true A4
  // sheets (794x1123 px = 210x297 mm). The same sheets drive the
  // on-screen Exact Preview and the Print/PDF output, so what the
  // user sees is exactly what prints: page 1 content can never run
  // underneath the letterhead footer.
  const SHEET = { w: 794, h: 1123, padX: 76, firstTop: 218, firstBottom: 1005, top: 70, bottom: 1053 };
  let sheetMeasurer = null;

  function collectLineHtml(el) {
    const lines = [];
    let cur = document.createElement('div');
    const push = () => { lines.push(cur.innerHTML); cur = document.createElement('div'); };
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === 1 && node.tagName === 'BR') push();
      else cur.appendChild(node.cloneNode(true));
    });
    push();
    return lines;
  }

  function measureSheetHtml(html) {
    if (!sheetMeasurer) {
      sheetMeasurer = document.createElement('div');
      sheetMeasurer.style.cssText = 'position:absolute; visibility:hidden; left:-9999px; top:0; line-height:1.6; word-break:break-word; text-align:justify;';
      document.body.appendChild(sheetMeasurer);
    }
    sheetMeasurer.style.width = (SHEET.w - SHEET.padX * 2) + 'px';
    sheetMeasurer.style.fontFamily = letterFontFamily();
    sheetMeasurer.style.fontSize = letterSizePt + 'pt';
    sheetMeasurer.innerHTML = html;
    return sheetMeasurer.offsetHeight;
  }

  function buildSheetData() {
    const lineH = Math.ceil(letterSizePt * (96 / 72) * 1.6);
    const units = [];
    const addLines = (el) => {
      if (!el || !el.innerHTML.trim()) return;
      collectLineHtml(el).forEach(html => {
        const wrapped = `<div class="sheet-line">${html || '&nbsp;'}</div>`;
        units.push({ html: wrapped, h: html ? measureSheetHtml(wrapped) : lineH, kind: 'line' });
      });
    };
    addLines(letterBodyRendered);
    if (letterSignatures.innerHTML.trim()) {
      const html = `<div class="sheet-block">${letterSignatures.innerHTML}</div>`;
      units.push({ html, h: measureSheetHtml(html) + 10, kind: 'block' });
    }
    if (letterCopies.innerHTML.trim()) {
      Array.from(letterCopies.children).forEach(ch => {
        units.push({ html: ch.outerHTML, h: measureSheetHtml(ch.outerHTML), kind: 'line' });
      });
    }
    addLines(letterTrailing);

    const useLetterhead = selLetterhead.value === 'awc';
    const sheets = [];
    let cur = null;
    const newSheet = () => {
      const first = sheets.length === 0;
      const top = (first && useLetterhead) ? SHEET.firstTop : SHEET.top;
      const bottom = (first && useLetterhead) ? SHEET.firstBottom : SHEET.bottom;
      cur = { top, avail: bottom - top, used: 0, units: [] };
      sheets.push(cur);
    };
    newSheet();
    for (const u of units) {
      if (cur.units.length && cur.used + u.h > cur.avail) newSheet();
      cur.units.push(u);
      cur.used += u.h;
    }
    annexures.forEach((a, i) => {
      const heading = convertForLetter('ඇමුණුම ' + String(i + 1).padStart(2, '0'));
      const maxH = SHEET.bottom - SHEET.top - 70;
      const scale = Math.min((SHEET.w - SHEET.padX * 2) / a.w, maxH / a.h, 1);
      const wpx = Math.round(a.w * scale);
      const hpx = Math.round(a.h * scale);
      sheets.push({
        top: SHEET.top, avail: SHEET.bottom - SHEET.top, used: 0,
        units: [{ html: `<div class="annex-heading">${heading}</div><div style="text-align:center;"><img src="${a.dataUrl}" style="width:${wpx}px; height:${hpx}px;"></div>`, h: maxH, kind: 'block' }]
      });
    });
    return sheets.map((s, idx) => ({ ...s, letterhead: idx === 0 && useLetterhead }));
  }

  function sheetContentStyle(topPx) {
    return `top:${topPx}px; font-family:${letterFontFamily()}; font-size:${letterSizePt}pt; text-align:${letterAlign === 'both' ? 'justify' : letterAlign};`;
  }

  function buildExactPreview() {
    const assetBase = location.href.replace(/[^/]*$/, '');
    exactPreview.innerHTML = buildSheetData().map(s => `
      <div class="a4-sheet">
        ${s.letterhead ? `<img class="sheet-letterhead" src="${assetBase}assets/awc-letterhead.jpg" alt="">` : ''}
        <div class="sheet-content" style="${sheetContentStyle(s.top)}">${s.units.map(u => u.html).join('')}</div>
      </div>`).join('');
  }

  function setPreviewView(v) {
    previewView = v;
    btnViewEdit.classList.toggle('view-active', v === 'edit');
    btnViewExact.classList.toggle('view-active', v === 'exact');
    document.querySelector('.paper-container').style.display = v === 'edit' ? '' : 'none';
    exactPreview.style.display = v === 'exact' ? '' : 'none';
    if (v === 'exact') buildExactPreview();
  }

  // Copy the whole letter (body + signatures + copies) with formatting
  async function copyLetterFormatted() {
    const assetBase = location.href.replace(/[^/]*$/, '');
    // For pasting, keep the in-flow header/footer parts and drop the
    // print-only full-page background image.
    const pageHtml = printableA4Page.innerHTML
      .replace(/src="assets\//g, `src="${assetBase}assets/`)
      .replace(/<img class="letterhead-bg"[^>]*>/g, '');
    const html = `<div style="font-family: '${getSelectedFont(true)}', Arial, sans-serif; font-size: 12pt;">` + pageHtml + '</div>';
    try {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([inputText.value || ''], { type: 'text/plain' })
      });
      await navigator.clipboard.write([item]);
      showToast('Letter copied with formatting — paste into Word!', '✨');
    } catch (e) {
      showToast('Copy failed in this browser', '⚠️');
    }
  }

  // Letterhead Design Presets
  function updateLetterheadDesign() {
    const design = selLetterhead.value;
    if (design === 'none') {
      letterHeaderBanner.style.display = 'none';
      letterFooterBanner.style.display = 'none';
      letterheadBg.style.display = 'none';
      letterheadHeader.style.display = 'none';
      letterheadFooter.style.display = 'none';
      printableA4Page.classList.remove('has-letterhead');
    } else if (design === 'classic') {
      letterheadBg.style.display = 'none';
      letterheadHeader.style.display = 'none';
      letterheadFooter.style.display = 'none';
      printableA4Page.classList.remove('has-letterhead');
      letterHeaderBanner.style.display = 'block';
      letterFooterBanner.style.display = 'flex';
      letterHeadTitle.textContent = 'OFFICIAL COMMUNICATIONS & LEGAL ADVOCACY';
      letterHeadSub.textContent = 'SRI LANKA LEGAL & WELFARE DIRECTORATE';
      footEmail.textContent = 'official@advocacy.lk';
      footPhone.textContent = '+94 11 234 5678';
      footAddress.textContent = 'Colombo 07, Sri Lanka';
    } else {
      // AWC: use the real letterhead artwork as the page-1 background
      // (extracted from Hugo's own Word letter); the HTML text banners
      // are hidden, their values kept only as the .DOC export fallback.
      letterHeaderBanner.style.display = 'none';
      letterFooterBanner.style.display = 'none';
      letterheadBg.style.display = 'block';
      letterheadHeader.style.display = 'block';
      letterheadFooter.style.display = 'block';
      printableA4Page.classList.add('has-letterhead');
      letterHeadTitle.textContent = 'ANIMAL WELFARE COALITION (AWC) - SRI LANKA';
      letterHeadSub.textContent = 'ANIMAL PROTECTION, REHABILITATION & ADVOCACY';
      footEmail.textContent = 'awcsrilanka@gmail.com';
      footPhone.textContent = '+94 71 915 9992';
      footAddress.textContent = 'No 02 Edward Place, Sri Saranankara Mawatha, Kalubowila';
    }
  }

  // Copy Plain Text
  async function copyOutput() {
    const text = outputText.value;
    if (!text) {
      showToast('Nothing to copy', '⚠️');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied plain text!');
    } catch (err) {
      outputText.select();
      document.execCommand('copy');
      showToast('Copied plain text!');
    }
  }

  // Copy for MS Word with Dual-Font formatting
  async function copyForWord() {
    if (!lastRichHtml) {
      showToast('Nothing to copy', '⚠️');
      return;
    }

    const plain = outputText.value;
    const fontName = getSelectedFont(false);
    const lines = lastRichHtml.split(/\r?\n|<br\s*\/?>/i);
    const paragraphsHtml = lines.map(line => {
      return `<p class="MsoNormal" style="margin: 0pt; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.15; font-family: '${fontName}', Arial, sans-serif; font-size: 12pt; text-align: justify; text-justify: inter-word;">${line || '&nbsp;'}</p>`;
    }).join('\n');

    const htmlToCopy = `
      <div style="font-family: '${fontName}', Arial, sans-serif; font-size: 12pt; line-height: 1.15; margin: 0; padding: 0; text-align: justify; text-justify: inter-word;">
        ${paragraphsHtml}
      </div>
    `;

    try {
      const blobHtml = new Blob([htmlToCopy], { type: 'text/html' });
      const blobText = new Blob([plain], { type: 'text/plain' });
      const clipboardItem = new ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText
      });
      await navigator.clipboard.write([clipboardItem]);
      showToast(`Copied text for Word! (${fontName} + Arial, 12pt, Justified)`, '✨');
    } catch (e) {
      copyOutput();
      showToast('Copied text (Paste directly in Word)', 'ℹ️');
    }
  }

  // Fetch an app asset as raw bytes (for DOCX embedding)
  async function fetchBytes(url) {
    const res = await fetch(url);
    return new Uint8Array(await res.arrayBuffer());
  }

  function dataUrlToBytes(dataUrl) {
    const b64 = dataUrl.split(',')[1] || '';
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return bytes;
  }

  // Download Native .DOCX File
  async function downloadNativeDocx(includeLetterhead = false) {
    const text = inputText.value || sampleComplaintLetter;
    if (!text) {
      showToast('Text is empty', '⚠️');
      return;
    }

    const selectedFont = getSelectedFont(includeLetterhead);
    let targetFont = selectedFont;
    let convertFn = unicodeToFM;

    if (selectedFont === 'IsiAbhaya') {
      convertFn = unicodeToIsi;
    } else if (selectedFont === 'unicode' || selectedFont === 'Iskoola Potha') {
      targetFont = 'Iskoola Potha';
      convertFn = null;
    } else {
      // 4u-Bindumathi, FM-Malithi, FM-Abhaya all use unicodeToFM
      convertFn = unicodeToFM;
    }

    const options = {
      targetFont,
      preserveEnglish: chkPreserveEnglish.checked,
      convertSinhalaFn: convertFn,
      fontSizePt: includeLetterhead ? letterSizePt : 12
    };

    // Letter Studio: export the formatted body (bold/underline/etc.)
    if (includeLetterhead) {
      options.richLines = extractRichLines();
      options.bodyAlign = letterAlign;
      const trailing = extractRichLines(letterTrailing);
      if (trailing.some(l => l.some(s => s.text && s.text.trim()))) {
        options.trailingLines = trailing;
      }
    }

    const useLetterheadImage = includeLetterhead && selLetterhead.value === 'awc';
    if (useLetterheadImage) {
      // Real AWC letterhead artwork as a page-1 background image,
      // the same technique as Hugo's own Word letters.
      try {
        options.letterheadImage = { data: await fetchBytes('assets/awc-letterhead.jpg'), ext: 'jpg' };
      } catch (e) { /* fall back to no letterhead image */ }
    } else if (includeLetterhead && selLetterhead.value !== 'none') {
      options.headerTitle = letterHeadTitle.textContent;
      options.headerSub = letterHeadSub.textContent;
      options.footerContact = `📧 ${footEmail.textContent}   |   📞 ${footPhone.textContent}   |   📍 ${footAddress.textContent}`;
    }

    // Signatures, copies and annexures (Letter Studio ending)
    if (includeLetterhead) {
      const sigs = getSelectedSignatories();
      if (sigs.length) {
        try {
          options.signatures = await Promise.all(sigs.map(async s => ({
            data: s.img.startsWith('data:') ? dataUrlToBytes(s.img) : await fetchBytes(s.img),
            ext: s.img.startsWith('data:') ? (s.ext || 'png') : s.img.split('.').pop().toLowerCase(),
            w: s.w, h: s.h,
            org: AWC_ORG_LINE,
            name: s.nameSi
          })));
        } catch (e) { /* signatures skipped if an image fails to load */ }
      }
      const copies = getCopiesLines();
      if (copies.length) options.copies = copies;
      if (annexures.length) {
        options.annexures = annexures.map((a, i) => ({
          data: dataUrlToBytes(a.dataUrl),
          ext: a.ext, w: a.w, h: a.h,
          heading: 'ඇමුණුම ' + String(i + 1).padStart(2, '0')
        }));
      }
    }

    const blob = window.DocxBuilder.buildDocx(text, options);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-${targetFont}-${Date.now()}.docx`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded .DOCX (12pt, Justified) with ${targetFont}!`, '📥');
  }

  // Signatures + copies as HTML for the .DOC export (images referenced
  // by absolute URL, so Word must be online to fetch them; the native
  // .DOCX export embeds the images properly).
  function buildEndingHtmlForDoc(fontName) {
    const assetBase = location.href.replace(/[^/]*$/, '');
    const sigs = getSelectedSignatories();
    let html = '';
    if (sigs.length) {
      const cells = sigs.map(s => `
        <td style="width: 50%; vertical-align: bottom; padding: 18pt 12pt 0 0;">
          <img src="${assetBase}${s.img}" style="max-height: 42pt; max-width: 160pt;"><br>
          <span style="border-top: 2pt dotted #000; display: block; padding-top: 4pt; font-family: '${fontName}', sans-serif; font-size: 11.5pt;">${convertForLetter(AWC_ORG_LINE)}<br>${convertForLetter(s.nameSi)}</span>
        </td>`);
      let rows = '';
      for (let i = 0; i < cells.length; i += 2) {
        rows += `<tr>${cells[i]}${cells[i + 1] || '<td style="width: 50%;"></td>'}</tr>`;
      }
      html += `<table style="width: 100%; border-collapse: collapse;">${rows}</table>`;
    }
    const copies = getCopiesLines();
    if (copies.length) {
      html += `<p class="MsoNormal" style="margin-top: 18pt; font-weight: bold; font-family: '${fontName}', sans-serif; font-size: 12pt;">${convertForLetter('පිටපත්:')}</p>`;
      html += copies.map((l, i) => `<p class="MsoNormal" style="font-family: '${fontName}', sans-serif; font-size: 12pt;">${i + 1}. ${convertForLetter(l)}</p>`).join('\n');
    }
    return html;
  }

  // Export to Word Document (.DOC fallback)
  function exportWordDoc(includeLetterhead = false) {
    const text = outputText.value;
    if (!text && !includeLetterhead) {
      showToast('Text is empty', '⚠️');
      return;
    }

    const fontName = getSelectedFont(includeLetterhead);
    const sourceHtml = lastRichHtml || escapeHtml(text);
    const lines = sourceHtml.split(/\r?\n|<br\s*\/?>/i);
    const paragraphsHtml = lines.map(line => {
      return `<p class="MsoNormal" style="margin: 0pt; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.15; font-size: 12pt; text-align: justify; text-justify: inter-word;">${line || '&nbsp;'}</p>`;
    }).join('\n');

    let headerHtml = '';
    let footerHtml = '';

    if (includeLetterhead && selLetterhead.value !== 'none') {
      headerHtml = `
        <div style="text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px;">
          <h2 style="font-family: Arial, sans-serif; color: #0f172a; margin: 0; font-size: 16pt;">${letterHeadTitle.textContent}</h2>
          <p style="font-family: Arial, sans-serif; color: #475569; margin: 4px 0 0 0; font-size: 10pt; letter-spacing: 1px;">${letterHeadSub.textContent}</p>
        </div>
      `;
      footerHtml = `
        <div style="border-top: 2px solid #f59e0b; padding-top: 10px; margin-top: 30px; font-family: Arial, sans-serif; font-size: 9pt; color: #475569; text-align: center;">
          <span>📧 ${footEmail.textContent}</span> &nbsp;|&nbsp; <span>📞 ${footPhone.textContent}</span> &nbsp;|&nbsp; <span>📍 ${footAddress.textContent}</span>
        </div>
      `;
    }

    const htmlDocument = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Formal Letter</title>
      <!--[if gte mso 9]>
      <xml>
      <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page { size: A4; margin: 2.5cm 2.5cm 2.5cm 2.5cm; mso-header-margin: 36pt; mso-footer-margin: 36pt; }
        body {
          font-family: '${fontName}', Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.15;
          color: #0f172a;
          margin: 0;
          padding: 0;
          text-align: justify;
          text-justify: inter-word;
        }
        p, div, li {
          margin: 0pt;
          margin-top: 0pt;
          margin-bottom: 0pt;
          padding: 0pt;
          line-height: 1.15;
          mso-line-height-rule: exactly;
          mso-para-margin-top: 0pt;
          mso-para-margin-bottom: 0pt;
          mso-para-margin-left: 0pt;
          mso-para-margin-right: 0pt;
          text-align: justify;
          text-justify: inter-word;
        }
        p.MsoNormal, li.MsoNormal, div.MsoNormal {
          mso-style-parent: "";
          margin: 0pt;
          margin-top: 0pt;
          margin-bottom: 0pt;
          margin-left: 0pt;
          margin-right: 0pt;
          mso-para-margin: 0pt;
          mso-pagination: widow-orphan;
          font-size: 12.0pt;
          font-family: "${fontName}", Arial, sans-serif;
          line-height: 1.15;
          text-align: justify;
          text-justify: inter-word;
        }
        .en-text { font-family: Arial, Helvetica, sans-serif !important; font-size: 12pt; font-weight: normal; }
        .si-text { font-family: '${fontName}', sans-serif; font-size: 12pt; }
      </style>
      </head>
      <body>
        <div class="Section1">
          ${headerHtml}
          ${paragraphsHtml}
          ${includeLetterhead ? buildEndingHtmlForDoc(fontName) : ''}
          ${footerHtml}
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + htmlDocument], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-${fontName}-${Date.now()}.doc`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded Word (.DOC, 12pt, Justified) with ${fontName}!`);
  }

  // Build an @font-face rule with the selected legacy font embedded as
  // base64, so Print / Save-as-PDF embeds the font in the PDF itself
  // (the letter then renders correctly on any computer).
  const embeddedFontCssCache = {};
  async function buildEmbeddedFontCss(fontName) {
    const families = ['4u-Bindumathi', 'FM-Malithi', 'FM-Abhaya', 'IsiAbhaya'];
    if (!families.includes(fontName)) return '';
    if (embeddedFontCssCache[fontName]) return embeddedFontCssCache[fontName];
    try {
      const buf = await (await fetch(`fonts/${fontName}.woff2`)).arrayBuffer();
      const bytes = new Uint8Array(buf);
      let bin = '';
      const CHUNK = 0x8000;
      for (let i = 0; i < bytes.length; i += CHUNK) {
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
      }
      const b64 = btoa(bin);
      const css = `@font-face { font-family: '${fontName}'; src: url(data:font/woff2;base64,${b64}) format('woff2'); }`;
      embeddedFontCssCache[fontName] = css;
      return css;
    } catch (e) {
      return '';
    }
  }

  // Print Document (Direct A4 Print Layout)
  async function printDocument(isLetterStudio = false) {
    const printWindow = window.open('', '_blank');
    const printableElement = isLetterStudio ? printableA4Page : null;
    const fontName = getSelectedFont(isLetterStudio);
    const withLetterhead = isLetterStudio && selLetterhead.value === 'awc';
    let bodyContent;
    let usedSheets = false;
    if (isLetterStudio && printableElement) {
      // Exact paginated sheets: identical layout to the Exact Preview,
      // so page 1 content can never run under the letterhead footer.
      const assetBase = location.href.replace(/[^/]*$/, '');
      try {
        const px2mm = (px) => Math.round(px * 0.26458 * 100) / 100;
        bodyContent = buildSheetData().map(s => `
          <div class="print-sheet">
            ${s.letterhead ? `<img class="sheet-letterhead" src="${assetBase}assets/awc-letterhead.jpg">` : ''}
            <div class="sheet-content" style="top:${px2mm(s.top)}mm; font-family:${letterFontFamily()}; font-size:${letterSizePt}pt; text-align:${letterAlign === 'both' ? 'justify' : letterAlign};">${s.units.map(u => u.html).join('')}</div>
          </div>`).join('');
        bodyContent = bodyContent.replace(/src="assets\//g, `src="${assetBase}assets/`);
        usedSheets = true;
      } catch (e) {
        bodyContent = printableElement.innerHTML.replace(/src="assets\//g, `src="${assetBase}assets/`);
        bodyContent = bodyContent.replace(/<img class="letterhead-part[^>]*>/g, '');
        bodyContent = `<div class="print-wrap ${withLetterhead ? 'with-letterhead' : ''}">${bodyContent}</div>`;
      }
    } else {
      bodyContent = `
      <div style="white-space: pre-wrap; font-family: '${fontName}', sans-serif; font-size: 12pt; line-height: 1.6; text-align: justify; text-justify: inter-word;">
        ${lastRichHtml ? lastRichHtml.replace(/\n/g, '<br>') : escapeHtml(outputText.value)}
      </div>
    `;
    }

    const fontFaceCss = await buildEmbeddedFontCss(fontName);
    printWindow.document.write(`
      <html>
        <head>
          <title>Formal Letter Print</title>
          <style>
            ${fontFaceCss}
            @page { size: A4; margin: ${isLetterStudio ? '0' : '1.5cm'}; }
            body { font-family: '${fontName}', sans-serif; padding: 0; margin: 0; background: #fff; color: #000; text-align: justify; text-justify: inter-word; }
            .en-text { font-family: Arial, Helvetica, sans-serif !important; font-weight: normal; }
            .print-sheet { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; break-after: page; }
            .print-sheet:last-child { page-break-after: auto; break-after: auto; }
            .sheet-letterhead { position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; }
            .sheet-content { position: absolute; left: 20mm; right: 20mm; line-height: 1.6; word-break: break-word; }
            .sheet-line { line-height: 1.6; min-height: 1.6em; }
            .sheet-block { margin-top: 3mm; }
            .print-wrap { position: relative; padding: 18mm 20mm; box-sizing: border-box; }
            .print-wrap.with-letterhead { padding: 54mm 20mm 24mm 20mm; }
            .letterhead-bg { display: none; }
            .print-wrap.with-letterhead .letterhead-bg { display: block; position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; z-index: 0; }
            .print-wrap > *:not(.letterhead-bg) { position: relative; z-index: 1; }
            .letter-header-banner { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 25px; }
            .letter-logo-title { font-family: Arial, sans-serif; font-size: 16pt; font-weight: bold; }
            .letter-logo-subtitle { font-family: Arial, sans-serif; font-size: 9pt; color: #555; }
            .letter-body-content { font-size: ${isLetterStudio ? letterSizePt : 12}pt; line-height: 1.6; font-family: '${fontName}', sans-serif; text-align: justify; text-justify: inter-word; }
            .letter-footer-banner { border-top: 2px solid #999; margin-top: 40px; padding-top: 10px; font-family: Arial, sans-serif; font-size: 9pt; display: flex; justify-content: space-between; }
            .letter-signatures { margin-top: 10mm; }
            .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm 14mm; }
            .sig-cell { text-align: left; break-inside: avoid; page-break-inside: avoid; }
            .sig-img-wrap { height: 15mm; display: flex; align-items: flex-end; }
            .sig-img { max-height: 15mm; max-width: 78%; }
            .sig-line { border-bottom: 1px dotted #999; width: 82%; margin: 1mm 0 2mm 0; }
            .sig-org, .sig-name { font-size: 11.5pt; line-height: 1.35; text-align: left; }
            .letter-copies { margin-top: 8mm; font-size: 12pt; }
            .copies-heading { font-weight: bold; margin-bottom: 1mm; text-align: left; }
            .copies-line { text-align: left; line-height: 1.4; }
            .annex-page { page-break-before: always; break-before: page; text-align: center; padding-top: 6mm; }
            .annex-heading { font-weight: bold; text-align: left; font-size: 12.5pt; margin-bottom: 5mm; }
            .annex-img { max-width: 170mm; max-height: 235mm; }
          </style>
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 400);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // Mode Switcher
  function setMode(mode) {
    currentMode = mode;
    tabBtns.forEach(btn => {
      if (btn.dataset.mode === mode) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    if (mode === 'u2fm') {
      inputLabel.textContent = 'Unicode Text';
      const font = getSelectedFont(false);
      outputLabel.textContent = `${font} Text`;
      inputText.placeholder = 'Paste or type Sinhala Unicode text with English words (e.g. LF-6345, TATA ACE)...';
      previewFontLabel.textContent = font;
    } else if (mode === 'fm2u') {
      inputLabel.textContent = '4u / FM Text';
      outputLabel.textContent = 'Sinhala Unicode Text';
      inputText.placeholder = 'Paste 4u / FM font text (e.g. Y%S ,xld)...';
      previewFontLabel.textContent = 'Iskoola Potha (Unicode)';
    } else if (mode === 'u2isi') {
      inputLabel.textContent = 'Unicode Text';
      outputLabel.textContent = 'IsiAbhaya Text';
      inputText.placeholder = 'Paste or type Sinhala Unicode text with English words...';
      fontSelect.value = 'IsiAbhaya';
      previewFontLabel.textContent = 'IsiAbhaya';
    } else if (mode === 'isi2u') {
      inputLabel.textContent = 'Isi Font Text';
      outputLabel.textContent = 'Sinhala Unicode Text';
      inputText.placeholder = 'Paste Isi font text (e.g. |±š z¹Y£)...';
      previewFontLabel.textContent = 'Iskoola Potha (Unicode)';
    } else if (mode === 'singlish') {
      inputLabel.textContent = 'Singlish (Phonetic)';
      outputLabel.textContent = 'Selected Font & Unicode Output';
      inputText.placeholder = 'Type English phonetic Sinhala (e.g. shree lankaa, mama gedhara yanawa)...';
      previewFontLabel.textContent = 'Iskoola Potha (Unicode)';
    }

    runConversion();
  }

  // View Switcher (Converter vs Letter Studio)
  function setView(view) {
    if (view === 'letter') {
      viewBtnLetter.classList.add('active');
      viewBtnConverter.classList.remove('active');
      converterView.style.display = 'none';
      letterStudioView.classList.add('active');
      updateLetterStudio();
    } else {
      viewBtnConverter.classList.add('active');
      viewBtnLetter.classList.remove('active');
      converterView.style.display = 'flex';
      letterStudioView.classList.remove('active');
    }
  }

  // Event Listeners
  inputText.addEventListener('input', runConversion);
  inputText.addEventListener('keyup', runConversion);
  chkPreserveEnglish.addEventListener('change', runConversion);
  chkHighlightEnglish.addEventListener('change', updateEnglishHighlight);

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => setMode(btn.dataset.mode));
  });

  btnSwapMode.addEventListener('click', () => {
    const prevOut = outputText.value;
    if (currentMode === 'u2fm') {
      setMode('fm2u');
      inputText.value = prevOut;
      runConversion();
      showToast('Swapped: 4u/FM ➔ Unicode');
    } else if (currentMode === 'fm2u') {
      setMode('u2fm');
      inputText.value = prevOut;
      runConversion();
      showToast('Swapped: Unicode ➔ 4u/FM');
    } else if (currentMode === 'u2isi') {
      setMode('isi2u');
      inputText.value = prevOut;
      runConversion();
      showToast('Swapped: Isi ➔ Unicode');
    } else if (currentMode === 'isi2u') {
      setMode('u2isi');
      inputText.value = prevOut;
      runConversion();
      showToast('Swapped: Unicode ➔ Isi');
    }
  });

  btnCopy.addEventListener('click', copyOutput);
  btnCopyWord.addEventListener('click', copyForWord);

  btnClear.addEventListener('click', () => {
    inputText.value = '';
    runConversion();
    inputText.focus();
    showToast('Cleared');
  });

  btnPaste.addEventListener('click', async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      inputText.value = clipText;
      runConversion();
      showToast('Pasted from clipboard');
    } catch (e) {
      inputText.focus();
      showToast('Press Ctrl+V to paste', 'ℹ️');
    }
  });

  btnLoadComplaint.addEventListener('click', () => {
    inputText.value = sampleComplaintLetter;
    setMode('u2fm');
    runConversion();
    showToast('Loaded AWC complaint letter with English terms!');
  });

  // DOCX & DOC exports
  btnExportDocx.addEventListener('click', () => downloadNativeDocx(false));
  btnLetterDocx.addEventListener('click', () => downloadNativeDocx(true));
  btnExportDoc.addEventListener('click', () => exportWordDoc(false));
  btnLetterDoc.addEventListener('click', () => exportWordDoc(true));

  btnPrint.addEventListener('click', () => printDocument(false));
  btnLetterPrint.addEventListener('click', () => printDocument(true));

  fontSelect.addEventListener('change', () => {
    const chosen = fontSelect.value;
    previewFontLabel.textContent = chosen;
    if (currentMode === 'u2fm') {
      outputLabel.textContent = `${chosen} Text`;
    }
    // Sync with letter studio
    selLetterFont.value = chosen;
    localStorage.setItem('sinhala_selected_font', chosen);
    runConversion();
  });

  fontSizeRange.addEventListener('input', () => {
    fontSizeVal.textContent = `${fontSizeRange.value}px`;
    previewBox.style.fontSize = `${fontSizeRange.value}px`;
  });

  viewBtnConverter.addEventListener('click', () => setView('converter'));
  viewBtnLetter.addEventListener('click', () => setView('letter'));

  selLetterhead.addEventListener('change', updateLetterheadDesign);

  // Preview zoom controls
  function applyPreviewZoom() {
    printableA4Page.style.zoom = previewZoom;
    exactPreview.style.zoom = previewZoom;
    zoomValue.textContent = Math.round(previewZoom * 100) + '%';
  }
  btnViewEdit.addEventListener('click', () => setPreviewView('edit'));
  btnViewExact.addEventListener('click', () => setPreviewView('exact'));
  btnZoomIn.addEventListener('click', () => { previewZoom = Math.min(1.6, +(previewZoom + 0.1).toFixed(2)); applyPreviewZoom(); });
  btnZoomOut.addEventListener('click', () => { previewZoom = Math.max(0.4, +(previewZoom - 0.1).toFixed(2)); applyPreviewZoom(); });
  btnZoomReset.addEventListener('click', () => { previewZoom = 1; applyPreviewZoom(); });

  // Formatting toolbar: keep the letter selection when clicking buttons
  document.querySelectorAll('#formatToolbar [data-fmt]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', () => applyInlineFormat(btn.dataset.fmt));
  });
  document.querySelectorAll('#formatToolbar [data-align]').forEach(btn => {
    btn.addEventListener('click', () => setLetterAlign(btn.dataset.align === 'justify' ? 'both' : btn.dataset.align));
  });
  selLetterSize.addEventListener('change', () => {
    letterSizePt = parseInt(selLetterSize.value, 10) || 12;
    letterBodyRendered.style.fontSize = letterSizePt + 'pt';
    letterTrailing.style.fontSize = letterSizePt + 'pt';
    if (previewView === 'exact') buildExactPreview();
  });
  btnCopyLetter.addEventListener('click', copyLetterFormatted);

  // Paste: allow formatted paste into the letter, then strip foreign
  // fonts/colours so the letter keeps its own font and size.
  letterBodyRendered.addEventListener('paste', () => {
    setTimeout(() => {
      letterBodyRendered.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
        el.removeAttribute('color');
        el.removeAttribute('face');
      });
    }, 0);
  });

  // Add your own signature (saved on this device)
  btnAddSig.addEventListener('click', () => {
    const nameSi = newSigNameSi.value.trim();
    const nameEn = newSigNameEn.value.trim() || nameSi;
    const file = newSigFile.files && newSigFile.files[0];
    if (!nameSi) { showToast('Enter the name in Sinhala', '⚠️'); return; }
    if (!file) { showToast('Choose a signature image', '⚠️'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        SIGNATORIES.push({
          id: 'custom-' + Date.now(),
          nameSi,
          nameEn,
          img: reader.result,
          ext: (file.type.includes('png') ? 'png' : 'jpg'),
          w: img.naturalWidth,
          h: img.naturalHeight,
          custom: true
        });
        saveCustomSignatures();
        renderSigCheckboxes();
        updateLetterEnding();
        newSigNameSi.value = '';
        newSigNameEn.value = '';
        newSigFile.value = '';
        showToast('Signature added!', '✍️');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  copiesText.addEventListener('input', updateLetterEnding);

  annexInput.addEventListener('change', () => {
    const files = Array.from(annexInput.files || []);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          annexures.push({
            name: file.name,
            dataUrl: reader.result,
            ext: (file.name.split('.').pop() || 'png').toLowerCase().replace('jpeg', 'jpg'),
            w: img.naturalWidth,
            h: img.naturalHeight
          });
          renderAnnexList();
          updateLetterEnding();
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
    annexInput.value = '';
  });

  selLetterFont.addEventListener('change', () => {
    const chosen = selLetterFont.value;
    fontSelect.value = chosen;
    localStorage.setItem('sinhala_selected_font', chosen);
    updateLetterStudio();
  });

  btnThemeToggle.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('sinhala_font_theme', next);
    showToast(`Switched to ${next} mode`);
  });

  // Modal
  btnCheatSheet.addEventListener('click', () => cheatModal.classList.add('active'));
  btnCloseModal.addEventListener('click', () => cheatModal.classList.remove('active'));
  cheatModal.addEventListener('click', (e) => {
    if (e.target === cheatModal) cheatModal.classList.remove('active');
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      copyForWord();
    }
    if (e.key === 'Escape' && cheatModal.classList.contains('active')) {
      cheatModal.classList.remove('active');
    }
  });

  // Embedded fonts: ask the browser to load each @font-face family
  // (see css/style.css) and re-render once they are ready, so the
  // preview does not stay on the fallback font on first load.
  let embeddedFontsReady = false;
  function loadEmbeddedFonts() {
    if (!document.fonts || !document.fonts.load) { embeddedFontsReady = true; return; }
    const families = ['4u-Bindumathi', 'FM-Malithi', 'FM-Abhaya', 'IsiAbhaya'];
    Promise.all(families.map((name) => document.fonts.load(`16px "${name}"`).catch(() => [])))
      .then(() => {
        if (!embeddedFontsReady) {
          embeddedFontsReady = true;
          runConversion();
        }
      })
      .catch(() => { embeddedFontsReady = true; });
  }

  // Init
  const savedTheme = localStorage.getItem('sinhala_font_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Set default font to 4u-Bindumathi
  const savedFont = localStorage.getItem('sinhala_selected_font') || '4u-Bindumathi';
  fontSelect.value = savedFont;
  selLetterFont.value = savedFont;
  previewFontLabel.textContent = savedFont;

  setMode('u2fm'); // Default mode: Unicode -> 4u / FM
  btnViewEdit.classList.add('view-active');
  loadCustomSignatures();
  renderSigCheckboxes();
  renderAnnexList();
  updateLetterheadDesign();

  // Load sample on start
  inputText.value = sampleComplaintLetter;
  runConversion();
  loadEmbeddedFonts();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

})();
