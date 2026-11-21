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
        const res = window.MixedFontFormatter.convertWithPreservation(val, targetType, convertFn);
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

  // Update Letter Studio Layout
  function updateLetterStudio() {
    const val = inputText.value || sampleComplaintLetter;
    const fontChoice = selLetterFont.value; // '4u-Bindumathi', 'FM-Malithi', 'FM-Abhaya', 'IsiAbhaya', 'unicode'
    
    let richContent = '';
    if (fontChoice === 'unicode') {
      richContent = escapeHtml(val).replace(/\n/g, '<br>');
      letterBodyRendered.style.fontFamily = "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif";
    } else {
      const isIsi = (fontChoice === 'IsiAbhaya');
      const convertFn = isIsi ? unicodeToIsi : unicodeToFM;
      const res = window.MixedFontFormatter.convertWithPreservation(val, isIsi ? 'isi' : 'fm', convertFn);
      richContent = res.richHtml.replace(/\n/g, '<br>');
      letterBodyRendered.style.fontFamily = `'${fontChoice}', sans-serif`;
    }

    letterBodyRendered.innerHTML = richContent;
    updateEnglishHighlight();
  }

  // Letterhead Design Presets
  function updateLetterheadDesign() {
    const design = selLetterhead.value;
    if (design === 'none') {
      letterHeaderBanner.style.display = 'none';
      letterFooterBanner.style.display = 'none';
    } else if (design === 'classic') {
      letterHeaderBanner.style.display = 'block';
      letterFooterBanner.style.display = 'flex';
      letterHeadTitle.textContent = 'OFFICIAL COMMUNICATIONS & LEGAL ADVOCACY';
      letterHeadSub.textContent = 'SRI LANKA LEGAL & WELFARE DIRECTORATE';
      footEmail.textContent = 'official@advocacy.lk';
      footPhone.textContent = '+94 11 234 5678';
      footAddress.textContent = 'Colombo 07, Sri Lanka';
    } else {
      letterHeaderBanner.style.display = 'block';
      letterFooterBanner.style.display = 'flex';
      letterHeadTitle.textContent = 'ANIMAL WELFARE COALITION (AWC) - SRI LANKA';
      letterHeadSub.textContent = 'ANIMAL PROTECTION, REHABILITATION & ADVOCACY';
      footEmail.textContent = 'awcsrilanka@gmail.com';
      footPhone.textContent = '+94 71 915 9992';
      footAddress.textContent = 'No 02 Edward Place, Kalubowila';
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

  // Download Native .DOCX File
  function downloadNativeDocx(includeLetterhead = false) {
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
      fontSizePt: 12
    };

    if (includeLetterhead && selLetterhead.value !== 'none') {
      options.headerTitle = letterHeadTitle.textContent;
      options.headerSub = letterHeadSub.textContent;
      options.footerContact = `📧 ${footEmail.textContent}   |   📞 ${footPhone.textContent}   |   📍 ${footAddress.textContent}`;
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

  // Print Document (Direct A4 Print Layout)
  function printDocument(isLetterStudio = false) {
    const printableElement = isLetterStudio ? document.getElementById('printableA4Page') : null;
    const fontName = getSelectedFont(isLetterStudio);
    const bodyContent = isLetterStudio && printableElement ? printableElement.innerHTML : `
      <div style="white-space: pre-wrap; font-family: '${fontName}', sans-serif; font-size: 12pt; line-height: 1.6; text-align: justify; text-justify: inter-word;">
        ${lastRichHtml ? lastRichHtml.replace(/\n/g, '<br>') : escapeHtml(outputText.value)}
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Formal Letter Print</title>
          <style>
            @page { size: A4; margin: 1.5cm; }
            body { font-family: '${fontName}', sans-serif; padding: 0; margin: 0; background: #fff; color: #000; text-align: justify; text-justify: inter-word; }
            .en-text { font-family: Arial, Helvetica, sans-serif !important; font-weight: normal; }
            .letter-header-banner { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 25px; }
            .letter-logo-title { font-family: Arial, sans-serif; font-size: 16pt; font-weight: bold; }
            .letter-logo-subtitle { font-family: Arial, sans-serif; font-size: 9pt; color: #555; }
            .letter-body-content { font-size: 12pt; line-height: 1.6; font-family: '${fontName}', sans-serif; text-align: justify; text-justify: inter-word; }
            .letter-footer-banner { border-top: 2px solid #999; margin-top: 40px; padding-top: 10px; font-family: Arial, sans-serif; font-size: 9pt; display: flex; justify-content: space-between; }
          </style>
        </head>
        <body>
          ${bodyContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
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

  // Init
  const savedTheme = localStorage.getItem('sinhala_font_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Set default font to 4u-Bindumathi
  const savedFont = localStorage.getItem('sinhala_selected_font') || '4u-Bindumathi';
  fontSelect.value = savedFont;
  selLetterFont.value = savedFont;
  previewFontLabel.textContent = savedFont;

  setMode('u2fm'); // Default mode: Unicode -> 4u / FM
  updateLetterheadDesign();

  // Load sample on start
  inputText.value = sampleComplaintLetter;
  runConversion();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

})();
