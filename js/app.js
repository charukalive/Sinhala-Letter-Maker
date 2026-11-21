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
  const selLangMode = document.getElementById('selLangMode');
  const btnShareDocx = document.getElementById('btnShareDocx');
  const selTemplate = document.getElementById('selTemplate');
  const restoreFile = document.getElementById('restoreFile');
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
  const annexIndexText = document.getElementById('annexIndexText');
  const letterAnnexIndex = document.getElementById('letterAnnexIndex');
  const annexSlotsEl = document.getElementById('annexSlots');

  // AWC signatories: signature images extracted from Hugo's own letter
  // (16th October 2026 Letter to Min of Environment .docx), in the
  // letter's 2-column grid order. Org line is the same for all.
  const AWC_ORG_LINE = 'සත්ව සුබසාධන සංසදය';
  const AWC_ORG_EN = 'Animal Welfare Coalition (AWC)';
  // Letter language: 'si' = Sinhala, converted into the legacy font;
  // 'en' = English, kept exactly as typed in a normal English font,
  // with English signatory names and section headings.
  let letterLang = 'si';
  let SIGNATORIES = [
    { id: 'gihan', nameSi: 'ගිහාන් දිනුෂ්ක', nameEn: 'Gihan Dinushka', img: 'assets/signatures/gihan-dinushka.jpg', w: 389, h: 194 },
    { id: 'chamith', nameSi: 'වෛද්‍ය චමිත් නානායක්කාර', nameEn: 'Dr. Chamith Nanayakkara', img: 'assets/signatures/chamith-nanayakkara.jpg', w: 246, h: 204 },
    { id: 'thilini', nameSi: 'තිලිනි ගමගේ', nameEn: 'Thilini Gamage', img: 'assets/signatures/thilini-gamage.jpg', w: 602, h: 261 },
    { id: 'charuka', nameSi: 'චාරුක වික්‍රමසේකර', nameEn: 'Charuka Wickramasekara', img: 'assets/signatures/charuka-wickramasekara.png', w: 214, h: 91 },
    { id: 'mihiri', nameSi: 'මිහිරි සිරිවර්ධන', nameEn: 'Mihiri Siriwardhana', img: 'assets/signatures/mihiri-siriwardena.png', w: 176, h: 55 },
    { id: 'aravinda', nameSi: 'අරවින්ද ප්‍රනාන්දු', nameEn: 'Aravinda Fernando', img: 'assets/signatures/aravinda-fernando.jpg', w: 489, h: 173 }
  ];

  // Annexure images added by the user: { name, dataUrl, ext, w, h }
  // Annexures are organised in slots: slot i belongs to line i of
  // the annexure list, and holds that annexure's pages (images, or
  // the pages of one PDF). Only a slot's first page carries its
  // heading in the letter.
  let annexSlots = [{ pages: [] }];
  function annexHeading(idx, lineText) {
    const nn = String(idx + 1).padStart(2, '0');
    const base = letterLang === 'en' ? 'Annexure ' + nn : 'ඇමුණුම ' + nn;
    return lineText ? `${base} – ${lineText}` : base;
  }
  function flatAnnexPages() {
    const lines = annexIndexText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const out = [];
    annexSlots.forEach((slot, i) => {
      const clean = (lines[i] || '').replace(/^\s*\*\s*/, '');
      (slot.pages || []).forEach((p, j) => {
        out.push({ dataUrl: p.dataUrl, ext: p.ext, w: p.w, h: p.h, name: p.name, heading: annexHeading(i, clean), first: j === 0 });
      });
    });
    return out;
  }

  // Letter formatting state (Letter Studio)
  const selLetterSize = document.getElementById('selLetterSize');
  const selLineSpacing = document.getElementById('selLineSpacing');
  const selGapSigs = document.getElementById('selGapSigs');
  const selGapCopies = document.getElementById('selGapCopies');
  const selGapAnnex = document.getElementById('selGapAnnex');
  const chkContHeader = document.getElementById('chkContHeader');
  const gapSigsEl = document.getElementById('gapSigs');
  const gapCopiesEl = document.getElementById('gapCopies');
  const gapAnnexEl = document.getElementById('gapAnnex');
  const btnCopyLetter = document.getElementById('btnCopyLetter');
  const newSigNameSi = document.getElementById('newSigNameSi');
  const newSigNameEn = document.getElementById('newSigNameEn');
  const newSigFile = document.getElementById('newSigFile');
  const btnAddSig = document.getElementById('btnAddSig');
  let letterAlign = 'both'; // 'both' | 'left' | 'center' | 'right'
  let letterSizePt = 12;
  let letterLineHeight = 1.15;
  // Optional gap before each ending section: 'none' | 'space' | 'break'
  let gapBeforeSigs = 'none', gapBeforeCopies = 'none', gapBeforeAnnex = 'none';

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

  // ---- Draft auto-save + remembered settings + templates ----
  // Everything lives on this device only (localStorage), like the
  // custom signatures. The draft (letter text, copies, annexure
  // list) is saved as Hugo types, so closing the app or the phone
  // restarting never loses the letter.
  const LS_DRAFT = 'slm_draft_v1';
  const LS_DRAFT_ANNEX = 'slm_draft_annex_v1';
  const LS_SETTINGS = 'slm_settings_v1';
  const LS_TEMPLATES = 'slm_templates_v1';
  let draftSaveTimer = null;
  function saveDraft() {
    clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(() => {
      try {
        localStorage.setItem(LS_DRAFT, JSON.stringify({
          text: inputText.value, copies: copiesText.value, annexIndex: annexIndexText.value
        }));
      } catch (e) { /* storage unavailable */ }
      try {
        localStorage.setItem(LS_DRAFT_ANNEX, JSON.stringify(annexSlots));
      } catch (e) { /* annexure images can exceed the quota — the letter text is still saved */ }
    }, 300);
  }
  function currentSettings() {
    const sigTicks = {};
    SIGNATORIES.forEach(s => {
      const cb = document.getElementById('sigChk-' + s.id);
      if (cb) sigTicks[s.id] = cb.checked;
    });
    return {
      letterFont: selLetterFont.value, letterhead: selLetterhead.value, lang: letterLang,
      size: letterSizePt, spacing: letterLineHeight, align: letterAlign,
      gaps: { sigs: gapBeforeSigs, copies: gapBeforeCopies, annex: gapBeforeAnnex },
      sigTicks,
      contHeader: !!(document.getElementById('chkContHeader') || {}).checked
    };
  }
  function saveSettings() {
    try { localStorage.setItem(LS_SETTINGS, JSON.stringify(currentSettings())); } catch (e) { /* ignore */ }
  }
  function applySettings(st) {
    if (!st) return;
    if (st.letterFont) { selLetterFont.value = st.letterFont; fontSelect.value = st.letterFont; }
    if (st.letterhead) selLetterhead.value = st.letterhead;
    if (st.lang) { letterLang = st.lang; selLangMode.value = st.lang; }
    if (st.size) { letterSizePt = st.size; selLetterSize.value = String(st.size); }
    if (st.spacing) { letterLineHeight = st.spacing; selLineSpacing.value = String(st.spacing); }
    if (st.align) letterAlign = st.align;
    if (st.gaps) {
      gapBeforeSigs = st.gaps.sigs || 'none'; selGapSigs.value = gapBeforeSigs;
      gapBeforeCopies = st.gaps.copies || 'none'; selGapCopies.value = gapBeforeCopies;
      gapBeforeAnnex = st.gaps.annex || 'none'; selGapAnnex.value = gapBeforeAnnex;
    }
    if (st.sigTicks) {
      SIGNATORIES.forEach(s => {
        const cb = document.getElementById('sigChk-' + s.id);
        if (cb && s.id in st.sigTicks) cb.checked = !!st.sigTicks[s.id];
      });
    }
    const cont = document.getElementById('chkContHeader');
    if (cont && typeof st.contHeader === 'boolean') cont.checked = st.contHeader;
    letterBodyRendered.style.fontSize = letterSizePt + 'pt';
    letterTrailing.style.fontSize = letterSizePt + 'pt';
    letterBodyRendered.style.lineHeight = letterLineHeight;
    letterTrailing.style.lineHeight = letterLineHeight;
  }
  function restoreSavedState() {
    let settings = null, draft = null;
    try { settings = JSON.parse(localStorage.getItem(LS_SETTINGS) || 'null'); } catch (e) { /* ignore */ }
    try { draft = JSON.parse(localStorage.getItem(LS_DRAFT) || 'null'); } catch (e) { /* ignore */ }
    applySettings(settings);
    if (draft) {
      if (typeof draft.text === 'string') inputText.value = draft.text;
      if (typeof draft.copies === 'string') copiesText.value = draft.copies;
      if (typeof draft.annexIndex === 'string') annexIndexText.value = draft.annexIndex;
      try {
        const ann = JSON.parse(localStorage.getItem(LS_DRAFT_ANNEX) || '[]');
        if (Array.isArray(ann) && ann.length) {
          // Migrate the pre-slot shape (a flat list of images, one
          // annexure each) into one slot per annexure.
          annexSlots = ann.map(a => a && Array.isArray(a.pages)
            ? a
            : { pages: [{ dataUrl: a.dataUrl, ext: a.ext, w: a.w, h: a.h, name: a.name }] });
        }
      } catch (e) { /* ignore */ }
      renderAnnexSlots();
    }
    return !!draft;
  }
  function loadTemplates() {
    try { return JSON.parse(localStorage.getItem(LS_TEMPLATES) || '{}') || {}; } catch (e) { return {}; }
  }
  function saveTemplates(t) {
    try { localStorage.setItem(LS_TEMPLATES, JSON.stringify(t)); } catch (e) { /* ignore */ }
  }
  function refreshTemplateList() {
    const t = loadTemplates();
    const names = Object.keys(t);
    selTemplate.innerHTML = names.length
      ? names.map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('')
      : '<option value="">No saved templates</option>';
  }
  function applyTemplateState(state) {
    if (!state) return;
    if (typeof state.text === 'string') inputText.value = state.text;
    if (typeof state.copies === 'string') copiesText.value = state.copies;
    if (typeof state.annexIndex === 'string') annexIndexText.value = state.annexIndex;
    applySettings(state.settings);
    updateLetterheadDesign();
    updateLetterStudio();
    saveSettings();
    saveDraft();
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

  // A line that starts with * is a point — render the * as a
  // bullet ● (in the English font, like Hugo's other symbols). The
  // source text keeps the *; only the rendering changes.
  const bulletizeLine = (line) => line.replace(/^(\s*)\*(?=[ \t]|$)[ \t]*/, '$1● ');

  // Convert one raw text run (no newlines) to letter HTML.
  function convertRawText(s) {
    if (letterLang === 'en') return escapeHtml(s);
    const fontChoice = selLetterFont.value;
    if (fontChoice === 'unicode') return escapeHtml(s);
    const isIsi = (fontChoice === 'IsiAbhaya');
    const convertFn = isIsi ? unicodeToIsi : unicodeToFM;
    return window.MixedFontFormatter.convertWithPreservation(s, isIsi ? 'isi' : 'fm', convertFn, fontChoice).richHtml;
  }

  // One letter line: Hugo's inline markup is applied here —
  // *text* becomes bold (asterisks hidden) and "text" becomes bold
  // (quotes still shown), so crucial content stands out in print.
  function renderLineHtml(line) {
    const parts = [];
    const re = /"([^"\n]+)"|\*([^*\n]+)\*/g;
    let last = 0, m;
    while ((m = re.exec(line)) !== null) {
      if (m.index > last) parts.push({ bold: false, s: line.slice(last, m.index) });
      parts.push({ bold: true, s: m[2] !== undefined ? m[2] : m[0] });
      last = m.index + m[0].length;
    }
    if (last < line.length) parts.push({ bold: false, s: line.slice(last) });
    if (!parts.length) parts.push({ bold: false, s: '' });
    return parts.map(p => {
      const html = convertRawText(p.s);
      return p.bold ? `<b>${html}</b>` : html;
    }).join('');
  }

  function renderTextToHtml(text) {
    return (text || '').split('\n').map(l => renderLineHtml(bulletizeLine(l))).join('<br>');
  }

  // Page breaks live in the editable preview DOM, which is rebuilt
  // whenever the input text or letter font changes. Remember each
  // break's line position and restore it after every rebuild, so a
  // break can never silently vanish before printing.
  // Remember each break by the TEXT of the line it follows, not just
  // its line number — if Hugo edits the letter text above a break,
  // the break then stays with its own line instead of drifting onto
  // whatever line now happens to have the same number.
  function getPageBreakAnchors(rootEl) {
    const anchors = [];
    let lastText = '';
    let lastTextLine = -1;
    collectLineHtml(rootEl).forEach((frag, i) => {
      if (frag.includes('page-break-marker')) {
        anchors.push({ line: i, beforeText: lastText, beforeLine: lastTextLine });
        return;
      }
      const t = frag.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (t) { lastText = t.slice(0, 80); lastTextLine = i; }
    });
    return anchors;
  }

  function restorePageBreak(anchor) {
    if (anchor.beforeText && anchor.beforeLine >= 0) {
      const frags = collectLineHtml(letterBodyRendered);
      for (let j = 0; j < frags.length; j++) {
        if (frags[j].includes('page-break-marker')) continue;
        const t = frags[j].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
        if (t && t === anchor.beforeText) {
          // The break goes immediately after the line it followed.
          // (Any blank line that sat between that line and the break
          // is not preserved — the break's place among the text is.)
          insertPageBreakAtLine(j + 1);
          return;
        }
      }
    }
    insertPageBreakAtLine(anchor.line);
  }

  function createPageBreakMarker() {
    const marker = document.createElement('div');
    marker.className = 'page-break-marker';
    marker.contentEditable = 'false';
    marker.title = 'Tap to remove this page break';
    marker.textContent = '⤓ PAGE BREAK — NEXT PAGE STARTS HERE (tap ✕ to remove)';
    return marker;
  }

  function insertPageBreakAtLine(lineIdx) {
    const marker = createPageBreakMarker();
    if (lineIdx <= 0) {
      letterBodyRendered.prepend(marker);
      marker.after(document.createElement('br'));
      return;
    }
    // Lines are separated by <br>s that may sit inside formatting
    // spans; index them in document order, exactly as
    // getPageBreakLineIndices counts them.
    const refBr = letterBodyRendered.querySelectorAll('br')[lineIdx - 1];
    if (refBr) {
      refBr.after(marker);
      marker.after(document.createElement('br'));
    } else {
      letterBodyRendered.appendChild(document.createElement('br'));
      letterBodyRendered.appendChild(marker);
    }
  }

  // Formatting survival: the letter body is rebuilt from the input
  // text on every edit, which used to wipe bold/italic/underline/
  // colour Hugo applied in the preview. Capture each formatted
  // line's segments before the rebuild and re-apply them afterwards
  // to lines whose text is unchanged (matched in order).
  function fragmentSegments(fragHtml) {
    const tmp = document.createElement('div');
    tmp.innerHTML = fragHtml;
    const segs = [];
    const walk = (node, flags) => {
      node.childNodes.forEach(ch => {
        if (ch.nodeType === 3) {
          if (ch.nodeValue) {
            const seg = { text: ch.nodeValue, bold: !!flags.bold, italic: !!flags.italic, underline: !!flags.underline, latin: !!flags.latin };
            if (flags.color) seg.color = flags.color;
            segs.push(seg);
          }
        } else if (ch.nodeType === 1) {
          const f = { ...flags };
          const tag = ch.tagName;
          if (tag === 'B' || tag === 'STRONG') f.bold = true;
          if (tag === 'I' || tag === 'EM') f.italic = true;
          if (tag === 'U') f.underline = true;
          const col = elementColor(ch);
          if (col) f.color = col;
          if (ch.classList && ch.classList.contains('en-text')) f.latin = true;
          if (ch.classList && ch.classList.contains('si-text')) f.latin = false;
          walk(ch, f);
        }
      });
    };
    walk(tmp, {});
    return segs;
  }
  function captureLineFormats() {
    const out = [];
    collectLineHtml(letterBodyRendered).forEach(frag => {
      if (frag.includes('page-break-marker')) return;
      const text = frag.replace(/<[^>]+>/g, '');
      if (!text) return;
      const segs = fragmentSegments(frag);
      if (segs.some(s => s.bold || s.italic || s.underline || s.color)) out.push({ text, segs });
    });
    return out;
  }
  function segToHtml(s) {
    let h = escapeHtml(s.text);
    if (s.color) h = `<span style="color:${s.color}">${h}</span>`;
    if (s.underline) h = `<u>${h}</u>`;
    if (s.italic) h = `<i>${h}</i>`;
    if (s.bold) h = `<b>${h}</b>`;
    return `<span class="${s.latin ? 'en-text' : 'si-text'}">${h}</span>`;
  }
  function restoreLineFormats(saved) {
    if (!saved || !saved.length) return;
    let p = 0;
    const frags = collectLineHtml(letterBodyRendered).map(frag => {
      if (p >= saved.length || frag.includes('page-break-marker')) return frag;
      const text = frag.replace(/<[^>]+>/g, '');
      if (text && text === saved[p].text) {
        const entry = saved[p++];
        return entry.segs.map(segToHtml).join('');
      }
      return frag;
    });
    if (p > 0) letterBodyRendered.innerHTML = frags.join('<br>');
  }

  // Update Letter Studio Layout
  function updateLetterStudio() {
    const val = inputText.value || sampleComplaintLetter;
    const fontChoice = selLetterFont.value; // '4u-Bindumathi', 'FM-Malithi', 'FM-Abhaya', 'IsiAbhaya', 'unicode'
    const breakAnchors = getPageBreakAnchors(letterBodyRendered);
    const savedFormats = captureLineFormats();

    const { mainText, trailingText } = splitTrailingSections(val);
    // Spacing comes only from the source text itself: a blank line
    // Hugo typed renders as exactly one blank line, and the app adds
    // no paragraph spacing of its own (before/after are zero in the
    // preview, the sheets and the DOCX, like Word with paragraph
    // spacing removed).
    const fam = letterLang === 'en'
      ? 'Arial, Helvetica, sans-serif'
      : fontChoice === 'unicode'
        ? "'Iskoola Potha', 'Noto Sans Sinhala', sans-serif"
        : `'${fontChoice}', sans-serif`;
    letterBodyRendered.style.fontFamily = fam;
    letterTrailing.style.fontFamily = fam;
    letterBodyRendered.innerHTML = renderTextToHtml(mainText);
    letterTrailing.innerHTML = trailingText.trim() ? renderTextToHtml(trailingText) : '';
    breakAnchors.forEach(a => restorePageBreak(a));
    restoreLineFormats(savedFormats);

    updateEnglishHighlight();
    updateLetterEnding();
  }

  // Convert a short Unicode string (signatory name, copies line, heading)
  // into rich HTML in the currently selected letter font, same as the body.
  function convertForLetter(unicodeText) {
    if (letterLang === 'en') return escapeHtml(unicodeText);
    const fontChoice = selLetterFont.value;
    if (fontChoice === 'unicode') return escapeHtml(unicodeText);
    const isIsi = (fontChoice === 'IsiAbhaya');
    const convertFn = isIsi ? unicodeToIsi : unicodeToFM;
    return window.MixedFontFormatter.convertWithPreservation(unicodeText, isIsi ? 'isi' : 'fm', convertFn, fontChoice).richHtml;
  }

  // Copies / annexure-index lines: EVERY space and every symbol or
  // Latin token is English (Arial) — only actual Sinhala words use
  // the legacy font. (The general converter keeps the spaces inside
  // Sinhala runs in the legacy font, which Hugo does not want here.)
  function convertSectionLine(text) {
    text = bulletizeLine(text || '');
    if (letterLang === 'en') return escapeHtml(text);
    const fontChoice = selLetterFont.value;
    if (fontChoice === 'unicode') return escapeHtml(text);
    const isIsi = (fontChoice === 'IsiAbhaya');
    const convertFn = isIsi ? unicodeToIsi : unicodeToFM;
    return text.split(/(\s+)/).map(part => {
      if (!part) return '';
      if (/^\s+$/.test(part) || !/[\u0D80-\u0DFF]/.test(part)) {
        return `<span class="en-text">${escapeHtml(part)}</span>`;
      }
      return window.MixedFontFormatter.convertWithPreservation(part, isIsi ? 'isi' : 'fm', convertFn, fontChoice).richHtml;
    }).join('');
  }

  function letterFontFamily() {
    if (letterLang === 'en') return 'Arial, Helvetica, sans-serif';
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
    // Gap indicators between the ending sections (edit view only —
    // the sheets, print and DOCX apply the real space / page break).
    const setGap = (el, mode, label, hasContent) => {
      if (!el) return;
      const show = hasContent && mode !== 'none';
      el.className = 'section-gap' + (show ? ' ' + mode : '');
      el.textContent = show && mode === 'break' ? `⤓ PAGE BREAK — ${label} starts on a new page` : '';
    };
    const sigs = getSelectedSignatories();
    letterSignatures.style.fontFamily = letterFontFamily();
    if (sigs.length) {
      letterSignatures.innerHTML = '<div class="sig-grid">' + sigs.map(s => `
        <div class="sig-cell">
          <div class="sig-img-wrap"><img class="sig-img" src="${s.img}" alt=""></div>
          <div class="sig-line"></div>
          <div class="sig-org">${convertForLetter(letterLang === 'en' ? AWC_ORG_EN : AWC_ORG_LINE)}</div>
          <div class="sig-name">${convertForLetter(letterLang === 'en' ? s.nameEn : s.nameSi)}</div>
        </div>`).join('') + '</div>';
    } else {
      letterSignatures.innerHTML = '';
    }

    const copies = getCopiesLines();
    letterCopies.style.fontFamily = letterFontFamily();
    letterCopies.innerHTML = copies.length
      ? `<div class="copies-heading">${convertForLetter(letterLang === 'en' ? 'Copies:' : 'පිටපත්:')}</div>` + copies.map((l, i) => `<div class="copies-line"><span class="en-text">${i + 1}. </span>${convertSectionLine(l)}</div>`).join('')
      : '';

    const annexIndexLines = annexIndexText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    letterAnnexIndex.style.fontFamily = letterFontFamily();
    letterAnnexIndex.innerHTML = annexIndexLines.length
      ? `<div class="copies-heading">${convertForLetter(letterLang === 'en' ? 'Annexures:' : 'ඇමිණුම්:')}</div>` + annexIndexLines.map((l, i) => `<div class="copies-line"><span class="en-text">${i + 1}. </span>${convertSectionLine(l)}</div>`).join('')
      : '';

    setGap(gapSigsEl, gapBeforeSigs, 'Signatures', sigs.length > 0);
    setGap(gapCopiesEl, gapBeforeCopies, 'Copies', copies.length > 0);
    setGap(gapAnnexEl, gapBeforeAnnex, 'Annexure list', annexIndexLines.length > 0);

    letterAnnexures.style.fontFamily = letterFontFamily();
    letterAnnexures.innerHTML = flatAnnexPages().map(a => `
      <div class="annex-page">
        ${a.first ? `<div class="annex-heading">${convertForLetter(a.heading)}</div>` : ''}
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
      document.getElementById('sigChk-' + s.id).addEventListener('change', () => { updateLetterEnding(); saveSettings(); });
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

  // One file box per annexure-list line; files added to a box
  // become that annexure's pages.
  function renderAnnexSlots() {
    if (!annexSlotsEl) return;
    const lines = annexIndexText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    const count = Math.max(lines.length, annexSlots.length, 1);
    while (annexSlots.length < count) annexSlots.push({ pages: [] });
    annexSlotsEl.innerHTML = annexSlots.map((slot, i) => {
      const clean = (lines[i] || '').replace(/^\s*\*\s*/, '');
      return `
      <div class="annex-slot">
        <div class="annex-slot-title">${escapeHtml(annexHeading(i, clean))}</div>
        <input type="file" accept="image/*,.pdf" multiple class="ending-file" data-slot-file="${i}">
        ${(slot.pages || []).length ? slot.pages.map((p, j) => `
          <div class="annex-list-item">
            <span>${escapeHtml(p.name || 'Image')}</span>
            <button class="annex-remove" data-slot="${i}" data-page="${j}" title="Remove">✕</button>
          </div>`).join('') : '<div class="annex-empty">No files yet — add images or a PDF</div>'}
      </div>`;
    }).join('');
  }

  function imageFileToPage(file) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => resolve({
          name: file.name, dataUrl: reader.result,
          ext: (file.name.split('.').pop() || 'png').toLowerCase().replace('jpeg', 'jpg'),
          w: img.naturalWidth, h: img.naturalHeight
        });
        img.onerror = () => resolve(null);
        img.src = reader.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  // A PDF annexure is rendered page by page (PDF.js, bundled with
  // the app so it works offline); the pages join that annexure's
  // slot, and only the first carries the annexure heading.
  async function pdfFileToPages(file) {
    if (!window.pdfjsLib) throw new Error('PDF support failed to load');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
    const buf = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    const pages = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(viewport.width);
      canvas.height = Math.round(viewport.height);
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
      pages.push({
        name: `${file.name} — page ${p}`,
        dataUrl: canvas.toDataURL('image/jpeg', 0.85),
        ext: 'jpg', w: canvas.width, h: canvas.height
      });
    }
    return pages;
  }

  async function addFilesToSlot(slotIdx, files) {
    showToast('Adding files…', '📎');
    for (const file of files) {
      try {
        if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
          const pages = await pdfFileToPages(file);
          pages.forEach(p => annexSlots[slotIdx].pages.push(p));
        } else if (file.type.startsWith('image/')) {
          const page = await imageFileToPage(file);
          if (page) annexSlots[slotIdx].pages.push(page);
        }
      } catch (e) {
        showToast(`Could not add ${file.name}`, '⚠️');
      }
    }
    renderAnnexSlots();
    updateLetterEnding();
    saveDraft();
  }

  // --- Doc-editor style formatting for the letter body ---
  // The A4 letter body is contenteditable: Bold/Italic/Underline apply
  // to the current selection, alignment and size apply to the letter.
  function applyInlineFormat(command) {
    // Capture the range BEFORE focus(): focusing the letter can
    // collapse the live selection to position 0, which would make
    // letterRange() return the wrong range.
    const r = letterRange();
    const saved = r ? r.cloneRange() : null;
    letterBodyRendered.focus();
    if (saved) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(saved);
    }
    document.execCommand(command, false, null);
  }

  // Remember the cursor/selection inside the letter body: tapping a
  // toolbar button on a phone drops the live selection, so toolbar
  // actions restore this saved range instead of acting at position 0.
  let savedLetterRange = null;
  document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (sel.rangeCount && letterBodyRendered.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      savedLetterRange = sel.getRangeAt(0).cloneRange();
    }
  });
  function letterRange() {
    const sel = window.getSelection();
    if (sel.rangeCount && letterBodyRendered.contains(sel.getRangeAt(0).commonAncestorContainer)) {
      return sel.getRangeAt(0);
    }
    if (savedLetterRange && letterBodyRendered.contains(savedLetterRange.commonAncestorContainer)) {
      return savedLetterRange;
    }
    return null;
  }

  // Insert a manual page break at the cursor: everything after it
  // starts on the next page in the Exact Preview, Print/PDF and DOCX.
  const btnPageBreak = document.getElementById('btnPageBreak');
  btnPageBreak.addEventListener('click', () => {
    const marker = createPageBreakMarker();
    // Capture the cursor BEFORE focus(): focusing can collapse the
    // live selection to the top of the letter, and the break would
    // land at position 0 instead of at the cursor.
    const captured = letterRange();
    const activeRange = captured ? captured.cloneRange() : null;
    letterBodyRendered.focus();
    const sel = window.getSelection();
    if (activeRange) {
      sel.removeAllRanges();
      sel.addRange(activeRange);
    }
    if (activeRange) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      const br1 = document.createElement('br');
      range.insertNode(br1);
      range.setStartAfter(br1);
      range.collapse(true);
      range.insertNode(marker);
      range.setStartAfter(marker);
      range.collapse(true);
      const br2 = document.createElement('br');
      range.insertNode(br2);
      range.setStartAfter(br2);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      letterBodyRendered.appendChild(document.createElement('br'));
      letterBodyRendered.appendChild(marker);
      letterBodyRendered.appendChild(document.createElement('br'));
    }
    if (previewView === 'exact') buildExactPreview();
    showToast('Page break added — content after it starts a new page', '⤓');
  });

  // Remove every page break in the letter at once.
  const btnRemoveBreaks = document.getElementById('btnRemoveBreaks');
  btnRemoveBreaks.addEventListener('click', () => {
    const markers = letterBodyRendered.querySelectorAll('.page-break-marker');
    if (!markers.length) {
      showToast('No page breaks in this letter', 'ℹ️');
      return;
    }
    markers.forEach(marker => {
      const next = marker.nextElementSibling;
      const prev = marker.previousElementSibling;
      marker.remove();
      if (next && next.tagName === 'BR') next.remove();
      else if (prev && prev.tagName === 'BR') prev.remove();
    });
    savedLetterRange = null;
    if (previewView === 'exact') buildExactPreview();
    showToast(`Removed ${markers.length} page break${markers.length > 1 ? 's' : ''}`, '🗑️');
  });

  // Word-style paragraph spacing: "Add/Remove Space Before/After
  // Paragraph". A space here is one blank line in the letter text,
  // so the buttons add or remove the blank line next to the
  // paragraph the cursor is in. They edit the source text itself,
  // which keeps the preview, the sheets, Print/PDF and the DOCX in
  // agreement — and Hugo's own blank lines are otherwise untouched.
  const btnSpaceBefore = document.getElementById('btnSpaceBefore');
  const btnSpaceAfter = document.getElementById('btnSpaceAfter');

  // The rendered line the cursor is on, translated to a source-text
  // line: page-break markers occupy a rendered line but have no
  // line in the source, so they are counted and subtracted.
  function caretLineInfo() {
    const range = letterRange();
    if (!range) return null;
    const target = range.startContainer;
    let line = 0, markers = 0, found = false;
    const walker = document.createTreeWalker(letterBodyRendered, NodeFilter.SHOW_ALL);
    let node;
    while ((node = walker.nextNode())) {
      if (node === target) { found = true; break; }
      if (node.nodeType === 1 && node.tagName === 'BR') line++;
      else if (node.nodeType === 1 && node.classList && node.classList.contains('page-break-marker')) markers++;
    }
    if (!found) return null;
    return { srcLine: line - markers };
  }

  function sourceLinesAndSplit() {
    const srcLines = inputText.value.split(/\r?\n/);
    const marker = /^\s*(පිටපත්|ඇමිණුම්|ඇමුණුම|ඇමුණුම්|Copies\b|Annexures?\b|Annexure Index\b)/;
    let split = srcLines.findIndex(l => marker.test(l));
    if (split === -1) split = srcLines.length;
    return { srcLines, split };
  }

  function paraSpaceState() {
    const info = caretLineInfo();
    if (!info || info.srcLine < 0) return null;
    const { srcLines, split } = sourceLinesAndSplit();
    const i = info.srcLine;
    if (i >= split) return null; // cursor sits in the trailing sections
    return {
      i, srcLines,
      blankBefore: i > 0 && srcLines[i - 1].trim() === '',
      blankAfter: i + 1 < split && srcLines[i + 1].trim() === ''
    };
  }

  function refreshParaSpaceLabels() {
    const st = paraSpaceState();
    btnSpaceBefore.textContent = st && st.blankBefore ? 'Remove space before' : 'Add space before';
    btnSpaceAfter.textContent = st && st.blankAfter ? 'Remove space after' : 'Add space after';
  }
  document.addEventListener('selectionchange', refreshParaSpaceLabels);

  function placeCaretAtSourceLine(srcIdx) {
    let line = 0, markers = 0, targetNode = null;
    const walker = document.createTreeWalker(letterBodyRendered, NodeFilter.SHOW_ALL);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 1 && node.tagName === 'BR') { line++; continue; }
      if (node.nodeType === 1 && node.classList && node.classList.contains('page-break-marker')) { markers++; continue; }
      if (node.nodeType === 3 && line - markers === srcIdx &&
          !(node.parentElement && node.parentElement.closest('.page-break-marker'))) {
        targetNode = node;
        break;
      }
    }
    letterBodyRendered.focus();
    const sel = window.getSelection();
    const r = document.createRange();
    if (targetNode) r.setStart(targetNode, 0);
    else { r.selectNodeContents(letterBodyRendered); r.collapse(false); }
    r.collapse(true);
    sel.removeAllRanges();
    sel.addRange(r);
    savedLetterRange = r.cloneRange();
  }

  function applyParaSpace(which) {
    const st = paraSpaceState();
    if (!st) {
      showToast('Tap in the letter first, in the paragraph to change', 'ℹ️');
      return;
    }
    const { i, srcLines } = st;
    let newLine = i;
    if (which === 'before') {
      if (st.blankBefore) { srcLines.splice(i - 1, 1); newLine = i - 1; }
      else { srcLines.splice(i, 0, ''); newLine = i + 1; }
    } else {
      if (st.blankAfter) srcLines.splice(i + 1, 1);
      else srcLines.splice(i + 1, 0, '');
    }
    inputText.value = srcLines.join('\n');
    updateLetterStudio();
    placeCaretAtSourceLine(newLine);
    refreshParaSpaceLabels();
    if (previewView === 'exact') buildExactPreview();
    showToast(which === 'before'
      ? (st.blankBefore ? 'Space before paragraph removed' : 'Space added before paragraph')
      : (st.blankAfter ? 'Space after paragraph removed' : 'Space added after paragraph'), '↕');
  }
  btnSpaceBefore.addEventListener('click', () => applyParaSpace('before'));
  btnSpaceAfter.addEventListener('click', () => applyParaSpace('after'));

  // Tap a page-break bar to remove that break (and one of the line
  // breaks inserted with it, so the text rejoins cleanly).
  letterBodyRendered.addEventListener('click', (e) => {
    const marker = e.target.closest ? e.target.closest('.page-break-marker') : null;
    if (!marker) return;
    e.preventDefault();
    const next = marker.nextElementSibling;
    const prev = marker.previousElementSibling;
    marker.remove();
    if (next && next.tagName === 'BR') next.remove();
    else if (prev && prev.tagName === 'BR') prev.remove();
    savedLetterRange = null;
    if (previewView === 'exact') buildExactPreview();
    showToast('Page break removed', '🗑️');
  });

  letterBodyRendered.addEventListener('input', () => {
    if (previewView === 'exact') buildExactPreview();
  });

  function setLetterAlign(align) {
    letterAlign = align;
    letterBodyRendered.style.textAlign = align === 'both' ? 'justify' : align;
    letterTrailing.style.textAlign = align === 'both' ? 'justify' : align;
    if (previewView === 'exact') buildExactPreview();
  }

  // The text colour set on an element, if any (FONT color attribute
  // or inline style), normalised to #rrggbb where possible.
  function elementColor(el) {
    if (!el || el.nodeType !== 1) return '';
    let c = '';
    if (el.getAttribute && el.getAttribute('color')) c = el.getAttribute('color');
    else if (el.style && el.style.color) c = el.style.color;
    if (!c) return '';
    const m = String(c).match(/rgb\(\s*(\d+),\s*(\d+),\s*(\d+)\s*\)/);
    if (m) return '#' + [m[1], m[2], m[3]].map(v => (+v).toString(16).padStart(2, '0')).join('');
    return String(c);
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
          // Bullet / symbol-only segments (* • ● ▪ etc.) always use
          // the English font, never the legacy Sinhala font.
          const segLatin = !!flags.latin || (!/[\u0D80-\u0DFF]/.test(text) && /[*•▪●○■◆◇►▸]/.test(text));
          const seg = { text, bold: !!flags.bold, italic: !!flags.italic, underline: !!flags.underline, latin: segLatin };
          if (flags.color) seg.color = flags.color;
          cur.push(seg);
        } else if (ch.nodeType === 1) {
          const tag = ch.tagName;
          if (tag === 'BR') { flush(); return; }
          if (ch.classList && ch.classList.contains('page-break-marker')) {
            flush();
            const pb = [];
            pb.pageBreak = true;
            lines.push(pb);
            return;
          }
          const f = { ...flags };
          if (tag === 'B' || tag === 'STRONG') f.bold = true;
          if (tag === 'I' || tag === 'EM') f.italic = true;
          if (tag === 'U') f.underline = true;
          const col = elementColor(ch);
          if (col) f.color = col;
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
  const SHEET = { w: 794, h: 1123, padX: 76, firstTop: 218, firstBottom: 950, top: 70, bottom: 1036 };
  let sheetMeasurer = null;

  function collectLineHtml(el) {
    // Split on every <br> in document order — line breaks often sit
    // inside the formatter's spans, not at the top level. Fragments
    // may be unbalanced (a span opened in one line, closed in the
    // next); the HTML parser balances them when measured/rendered.
    return el.innerHTML.split(/<br\s*\/?>/i);
  }

  // Split an HTML fragment into word chunks (tags travel with the
  // word that follows them) so a paragraph can be cut at a word
  // boundary; joining the chunks reproduces the fragment exactly.
  function tokenizeWords(html) {
    const chunks = [];
    let cur = '';
    const re = /(<[^>]+>)|([^<]+)/g;
    let m;
    while ((m = re.exec(html)) !== null) {
      if (m[1] !== undefined) { cur += m[1]; continue; }
      const parts = m[2].match(/\S+\s*|\s+/g) || [];
      for (const p of parts) {
        cur += p;
        if (/\S/.test(p)) { chunks.push(cur); cur = ''; }
      }
    }
    if (cur) {
      if (chunks.length) chunks[chunks.length - 1] += cur;
      else chunks.push(cur);
    }
    return chunks;
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
    sheetMeasurer.style.lineHeight = letterLineHeight;
    sheetMeasurer.innerHTML = html;
    return sheetMeasurer.offsetHeight;
  }

  function buildSheetData() {
    const lineH = Math.ceil(letterSizePt * (96 / 72) * letterLineHeight);
    const units = [];
    const addLines = (el) => {
      if (!el || !el.innerHTML.trim()) return;
      collectLineHtml(el).forEach(html => {
        if (html.includes('page-break-marker')) {
          units.push({ html: '', h: 0, kind: 'break', break: true });
          return;
        }
        const wrapped = `<div class="sheet-line">${html || '<br>'}</div>`;
        units.push({ html: wrapped, h: html ? Math.ceil(measureSheetHtml(wrapped)) + 1 : lineH, kind: 'line', frag: html });
      });
    };
    // Optional user-chosen gap before an ending section: extra
    // space, or a page break so the section starts on a new page.
    const gapUnitFor = (mode) => mode === 'break'
      ? { html: '', h: 0, kind: 'break', break: true }
      : mode === 'space'
        ? { html: `<div style="height:${lineH * 2}px"></div>`, h: lineH * 2, kind: 'spacer' }
        : null;
    addLines(letterBodyRendered);
    if (letterSignatures.innerHTML.trim()) {
      const g = gapUnitFor(gapBeforeSigs);
      if (g) units.push(g);
      const html = `<div class="sheet-block">${letterSignatures.innerHTML}</div>`;
      units.push({ html, h: Math.ceil(measureSheetHtml(html)) + 14, kind: 'block' });
    }
    // Section lines; a section heading is flagged keepWithNext so
    // it can never sit alone at the bottom of a page with its list
    // starting on the next page.
    const pushSectionLines = (container) => {
      const kids = Array.from(container.children);
      kids.forEach((ch, idx) => {
        const unit = { html: ch.outerHTML, h: Math.ceil(measureSheetHtml(ch.outerHTML)) + 1, kind: 'line' };
        if (idx === 0 && kids.length > 1 && ch.classList.contains('copies-heading')) unit.keepWithNext = true;
        units.push(unit);
      });
    };
    if (letterCopies.innerHTML.trim()) {
      const g = gapUnitFor(gapBeforeCopies);
      if (g && g.break) units.push(g);
      else units.push({ html: `<div style="height:${g ? 16 + lineH * 2 : 16}px"></div>`, h: g ? 16 + lineH * 2 : 16, kind: 'spacer' });
      pushSectionLines(letterCopies);
    }
    if (letterAnnexIndex.innerHTML.trim()) {
      const g = gapUnitFor(gapBeforeAnnex);
      if (g && g.break) units.push(g);
      else units.push({ html: `<div style="height:${g ? 16 + lineH * 2 : 16}px"></div>`, h: g ? 16 + lineH * 2 : 16, kind: 'spacer' });
      pushSectionLines(letterAnnexIndex);
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
    const isEmptyLine = (u) => u.kind === 'line' &&
      (u.html === '<div class="sheet-line"><br></div>' || u.html === '<div class="sheet-line"></div>');
    // Split a long paragraph at a word boundary so its first part
    // exactly fills the space left on the current sheet — pages then
    // fill up like a word processor instead of ending half-empty
    // whenever a whole paragraph does not fit.
    const splitLineUnit = (u, maxH) => {
      const chunks = tokenizeWords(u.frag);
      if (chunks.length < 2) return null;
      const heightOf = (frag) => Math.ceil(measureSheetHtml(`<div class="sheet-line">${frag}</div>`)) + 1;
      let lo = 1, hi = chunks.length - 1, best = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if (heightOf(chunks.slice(0, mid).join('')) <= maxH) { best = mid; lo = mid + 1; }
        else hi = mid - 1;
      }
      if (!best) return null;
      const headFrag = chunks.slice(0, best).join('');
      const tailFrag = chunks.slice(best).join('');
      if (!tailFrag.replace(/<[^>]+>/g, '').trim()) return null;
      return [
        { html: `<div class="sheet-line">${headFrag}</div>`, h: heightOf(headFrag), kind: 'line', frag: headFrag },
        { html: `<div class="sheet-line">${tailFrag}</div>`, h: heightOf(tailFrag), kind: 'line', frag: tailFrag }
      ];
    };

    newSheet();
    const queue = units.slice();
    for (let i = 0; i < queue.length;) {
      const u = queue[i];
      if (u.break) {
        // A break only starts a new page when real content precedes
        // it — a break at the very start must not blank page 1.
        if (cur.units.some(x => !isEmptyLine(x))) newSheet();
        i++;
        continue;
      }
      // Keep-with-next: if this heading fits but its first line
      // would not, move the heading to the next sheet as well.
      if (u.keepWithNext && cur.units.length) {
        const next = queue[i + 1];
        if (next && !next.break && u.h + next.h > (cur.avail - cur.used)) {
          newSheet();
          continue;
        }
      }
      const remaining = cur.avail - cur.used;
      if (cur.units.length && u.h > remaining) {
        if (u.kind === 'line' && u.frag && remaining >= lineH) {
          const parts = splitLineUnit(u, remaining);
          if (parts) {
            cur.units.push(parts[0]);
            cur.used += parts[0].h;
            queue.splice(i, 1, parts[1]);
            newSheet();
            continue;
          }
        }
        newSheet();
        continue;
      }
      cur.units.push(u);
      cur.used += u.h;
      i++;
    }
    // Never emit a blank sheet (e.g. from a break at the very end).
    for (let i = sheets.length - 1; i >= 0; i--) {
      if (sheets.length > 1 && !sheets[i].units.some(x => !isEmptyLine(x))) {
        sheets.splice(i, 1);
      }
    }
    flatAnnexPages().forEach(a => {
      const heading = a.first ? convertForLetter(a.heading) : '';
      const maxH = SHEET.bottom - SHEET.top - 70;
      const scale = Math.min((SHEET.w - SHEET.padX * 2) / a.w, maxH / a.h, 1);
      const wpx = Math.round(a.w * scale);
      const hpx = Math.round(a.h * scale);
      sheets.push({
        top: SHEET.top, avail: SHEET.bottom - SHEET.top, used: 0,
        units: [{ html: `${heading ? `<div class="annex-heading">${heading}</div>` : ''}<div style="text-align:center;"><img src="${a.dataUrl}" style="width:${wpx}px; height:${hpx}px;"></div>`, h: maxH, kind: 'block' }]
      });
    });
    return sheets.map((s, idx) => ({ ...s, letterhead: idx === 0 && useLetterhead }));
  }

  function sheetContentStyle(topPx) {
    return `top:${topPx}px; font-family:${letterFontFamily()}; font-size:${letterSizePt}pt; line-height:${letterLineHeight}; text-align:${letterAlign === 'both' ? 'justify' : letterAlign};`;
  }

  // Page furniture for sheets after the first: the page number
  // (mandatory — page 1 is counted but not numbered, numbering
  // starts at page 2, and annexure pages count too) and, when the
  // option is ticked, a small continuation header.
  function sheetFurniture(idx, total) {
    if (idx === 0) return '';
    let html = `<div class="sheet-page-num">Page ${idx + 1} of ${total}</div>`;
    if (chkContHeader && chkContHeader.checked && selLetterhead.value !== 'none') {
      html += `<div class="sheet-cont-head">${escapeHtml(letterHeadTitle.textContent)} — Continued</div>`;
    }
    return html;
  }

  function buildExactPreview() {
    const assetBase = location.href.replace(/[^/]*$/, '');
    const sheets = buildSheetData();
    exactPreview.innerHTML = sheets.map((s, idx) => `
      <div class="a4-sheet">
        ${sheetFurniture(idx, sheets.length)}
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
      printableA4Page.classList.remove('has-letterhead');
    } else if (design === 'classic') {
      letterheadBg.style.display = 'none';
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
      return `<p class="MsoNormal" style="margin: 0pt; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.15; font-family: '${fontName}', Arial, sans-serif; font-size: 12pt; text-align: justify; text-justify: inter-word;">${line || '<br>'}</p>`;
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

  // Build the native .DOCX (shared by Download and Share)
  async function buildLetterDocx(includeLetterhead = false) {
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
    if (includeLetterhead && letterLang === 'en') {
      // English letter: text stays exactly as typed, in Arial.
      targetFont = 'Arial';
      convertFn = null;
    }

    const options = {
      targetFont,
      preserveEnglish: chkPreserveEnglish.checked,
      convertSinhalaFn: convertFn,
      fontSizePt: includeLetterhead ? letterSizePt : 12,
      lineHeight: includeLetterhead ? letterLineHeight : 1
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
            org: letterLang === 'en' ? AWC_ORG_EN : AWC_ORG_LINE,
            name: letterLang === 'en' ? s.nameEn : s.nameSi
          })));
        } catch (e) { /* signatures skipped if an image fails to load */ }
      }
      const copies = getCopiesLines();
      if (copies.length) options.copies = copies.map(bulletizeLine);
      const annexIndexLines = annexIndexText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      if (annexIndexLines.length) options.annexIndex = annexIndexLines.map(bulletizeLine);
      options.sectionGaps = { sigs: gapBeforeSigs, copies: gapBeforeCopies, annex: gapBeforeAnnex };
      options.pageNumbers = true;
      if (chkContHeader.checked && selLetterhead.value !== 'none') {
        options.contHeaderText = letterHeadTitle.textContent;
      }
      const flat = flatAnnexPages();
      if (flat.length) {
        options.annexures = flat.map(a => ({
          data: dataUrlToBytes(a.dataUrl),
          ext: a.ext, w: a.w, h: a.h,
          heading: a.first ? a.heading : ''
        }));
      }
    }

    const blob = window.DocxBuilder.buildDocx(text, options);
    return { blob, filename: `letter-${targetFont}-${Date.now()}.docx`, targetFont };
  }

  async function downloadNativeDocx(includeLetterhead = false) {
    const built = await buildLetterDocx(includeLetterhead);
    if (!built) return;
    const url = URL.createObjectURL(built.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = built.filename;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded .DOCX (12pt, Justified) with ${built.targetFont}!`, '📥');
  }

  // Signatures + copies as HTML for the .DOC export (images referenced
  // by absolute URL, so Word must be online to fetch them; the native
  // .DOCX export embeds the images properly).
  function buildEndingHtmlForDoc(fontName) {
    const assetBase = location.href.replace(/[^/]*$/, '');
    const sigs = getSelectedSignatories();
    const gapHtml = (mode) => mode === 'break'
      ? '<p class="MsoNormal" style="page-break-before: always; margin: 0;"></p>'
      : mode === 'space' ? '<p class="MsoNormal"><br><br></p>' : '';
    let html = '';
    if (sigs.length) {
      html += gapHtml(gapBeforeSigs);
      const cells = sigs.map(s => `
        <td style="width: 50%; vertical-align: bottom; padding: 18pt 12pt 0 0;">
          <img src="${assetBase}${s.img}" style="max-height: 42pt; max-width: 160pt;"><br>
          <span style="border-top: 1pt dotted #999; display: block; padding-top: 4pt; font-family: '${fontName}', sans-serif; font-size: 11.5pt;">${convertForLetter(letterLang === 'en' ? AWC_ORG_EN : AWC_ORG_LINE)}<br>${convertForLetter(letterLang === 'en' ? s.nameEn : s.nameSi)}</span>
        </td>`);
      let rows = '';
      for (let i = 0; i < cells.length; i += 2) {
        rows += `<tr>${cells[i]}${cells[i + 1] || '<td style="width: 50%;"></td>'}</tr>`;
      }
      html += `<table style="width: 100%; border-collapse: collapse;">${rows}</table>`;
    }
    const copies = getCopiesLines();
    if (copies.length) {
      html += gapHtml(gapBeforeCopies);
      html += `<p class="MsoNormal" style="margin-top: 18pt; font-weight: bold; font-family: '${fontName}', sans-serif; font-size: 12pt;">${convertForLetter(letterLang === 'en' ? 'Copies:' : 'පිටපත්:')}</p>`;
      html += copies.map((l, i) => `<p class="MsoNormal" style="font-family: '${fontName}', sans-serif; font-size: 12pt;"><span class="en-text">${i + 1}. </span>${convertSectionLine(l)}</p>`).join('\n');
    }
    const annexIndexLines = annexIndexText.value.split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (annexIndexLines.length) {
      html += gapHtml(gapBeforeAnnex);
      html += `<p class="MsoNormal" style="margin-top: 18pt; font-weight: bold; font-family: '${fontName}', sans-serif; font-size: 12pt;">${convertForLetter(letterLang === 'en' ? 'Annexures:' : 'ඇමිණුම්:')}</p>`;
      html += annexIndexLines.map((l, i) => `<p class="MsoNormal" style="font-family: '${fontName}', sans-serif; font-size: 12pt;"><span class="en-text">${i + 1}. </span>${convertSectionLine(l)}</p>`).join('\n');
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
      return `<p class="MsoNormal" style="margin: 0pt; margin-top: 0pt; margin-bottom: 0pt; line-height: 1.15; font-size: 12pt; text-align: justify; text-justify: inter-word;">${line || '<br>'}</p>`;
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
        const sheets = buildSheetData();
        bodyContent = sheets.map((s, idx) => `
          <div class="print-sheet">
            ${s.letterhead ? `<img class="sheet-letterhead" src="${assetBase}assets/awc-letterhead.jpg">` : ''}
            ${sheetFurniture(idx, sheets.length)}
            <div class="sheet-content" style="top:${px2mm(s.top)}mm; font-family:${letterFontFamily()}; font-size:${letterSizePt}pt; line-height:${letterLineHeight}; text-align:${letterAlign === 'both' ? 'justify' : letterAlign};">${s.units.map(u => u.html).join('')}</div>
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
            .sheet-line { min-height: 1em; }
            .sheet-page-num { position: absolute; bottom: 10mm; left: 0; right: 0; text-align: center; font-family: Arial, sans-serif; font-size: 10pt; color: #666; }
            .sheet-cont-head { position: absolute; top: 8mm; left: 20mm; right: 20mm; text-align: center; font-family: Arial, sans-serif; font-size: 10.5pt; font-weight: bold; letter-spacing: 0.03em; color: #333; }
            .sheet-block { margin-top: 3mm; }
            .page-break-marker { page-break-after: always; break-after: page; height: 0; overflow: hidden; visibility: hidden; }
            .print-wrap { position: relative; padding: 18mm 20mm; box-sizing: border-box; }
            .print-wrap.with-letterhead { padding: 54mm 20mm 24mm 20mm; }
            .letterhead-bg { display: none; }
            .print-wrap.with-letterhead .letterhead-bg { display: block; position: absolute; top: 0; left: 0; width: 210mm; height: 297mm; z-index: 0; }
            .print-wrap > *:not(.letterhead-bg) { position: relative; z-index: 1; }
            .letter-header-banner { text-align: center; border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 25px; }
            .letter-logo-title { font-family: Arial, sans-serif; font-size: 16pt; font-weight: bold; }
            .letter-logo-subtitle { font-family: Arial, sans-serif; font-size: 9pt; color: #555; }
            .letter-body-content { font-size: ${isLetterStudio ? letterSizePt : 12}pt; line-height: ${isLetterStudio ? letterLineHeight : 1.6}; font-family: '${fontName}', sans-serif; text-align: justify; text-justify: inter-word; }
            .letter-footer-banner { border-top: 2px solid #999; margin-top: 40px; padding-top: 10px; font-family: Arial, sans-serif; font-size: 9pt; display: flex; justify-content: space-between; }
            .letter-signatures { margin-top: 10mm; }
            .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm 14mm; }
            .sig-cell { text-align: left; break-inside: avoid; page-break-inside: avoid; }
            .sig-img-wrap { height: 15mm; display: flex; align-items: flex-end; }
            .sig-img { max-height: 15mm; max-width: 78%; }
            .sig-line { border-bottom: 1px dotted #bbb; width: 72%; margin: 1mm 0 2mm 0; }
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
    // Wait for the embedded font so line breaks match the preview
    // measurement before the print dialog opens.
    let printed = false;
    const doPrint = () => {
      if (printed) return;
      printed = true;
      setTimeout(() => printWindow.print(), 60);
    };
    if (printWindow.document.fonts && printWindow.document.fonts.ready) {
      printWindow.document.fonts.ready.then(doPrint);
      setTimeout(doPrint, 1500);
    } else {
      setTimeout(doPrint, 400);
    }
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
  inputText.addEventListener('input', saveDraft);
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

  selLetterhead.addEventListener('change', () => { updateLetterheadDesign(); saveSettings(); });

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
  // Text colour swatches: apply to the selected letter text, like
  // Word's font colour. The colour is part of the line's formatting,
  // so it survives edits and flows into Print/PDF and the DOCX.
  document.querySelectorAll('#formatToolbar [data-color]').forEach(btn => {
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('click', () => {
      const r = letterRange();
      const saved = r ? r.cloneRange() : null;
      letterBodyRendered.focus();
      if (saved) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(saved);
      }
      document.execCommand('foreColor', false, btn.dataset.color);
      if (previewView === 'exact') buildExactPreview();
    });
  });
  document.querySelectorAll('#formatToolbar [data-align]').forEach(btn => {
    btn.addEventListener('click', () => setLetterAlign(btn.dataset.align === 'justify' ? 'both' : btn.dataset.align));
  });
  selLetterSize.addEventListener('change', () => {
    letterSizePt = parseInt(selLetterSize.value, 10) || 12;
    letterBodyRendered.style.fontSize = letterSizePt + 'pt';
    letterTrailing.style.fontSize = letterSizePt + 'pt';
    if (previewView === 'exact') buildExactPreview();
    saveSettings();
  });
  selLineSpacing.addEventListener('change', () => {
    letterLineHeight = parseFloat(selLineSpacing.value) || 1.15;
    letterBodyRendered.style.lineHeight = letterLineHeight;
    letterTrailing.style.lineHeight = letterLineHeight;
    if (previewView === 'exact') buildExactPreview();
    saveSettings();
  });
  letterBodyRendered.style.lineHeight = letterLineHeight;
  letterTrailing.style.lineHeight = letterLineHeight;
  selGapSigs.addEventListener('change', () => { gapBeforeSigs = selGapSigs.value; updateLetterEnding(); saveSettings(); });
  selGapCopies.addEventListener('change', () => { gapBeforeCopies = selGapCopies.value; updateLetterEnding(); saveSettings(); });
  selGapAnnex.addEventListener('change', () => { gapBeforeAnnex = selGapAnnex.value; updateLetterEnding(); saveSettings(); });

  chkContHeader.addEventListener('change', () => {
    saveSettings();
    if (previewView === 'exact') buildExactPreview();
  });

  // Letter language: Sinhala (converted) or English (as typed)
  selLangMode.addEventListener('change', () => {
    letterLang = selLangMode.value;
    updateLetterStudio();
    saveSettings();
    showToast(letterLang === 'en' ? 'English letter — text stays exactly as typed' : 'Sinhala letter — text converts to the letter font', '🌐');
  });

  // Templates: built-in AWC setups + Hugo's own saved templates
  const applyAwcPreset = (lang) => {
    applyTemplateState({
      settings: {
        letterhead: 'awc', lang,
        sigTicks: Object.fromEntries(SIGNATORIES.map(s => [s.id, true]))
      }
    });
    showToast(lang === 'en' ? 'AWC English setup applied — all signatories on, English names' : 'AWC Sinhala setup applied — all signatories on', '🗂️');
  };
  document.getElementById('btnPresetSi').addEventListener('click', () => applyAwcPreset('si'));
  document.getElementById('btnPresetEn').addEventListener('click', () => applyAwcPreset('en'));
  document.getElementById('btnSaveTemplate').addEventListener('click', () => {
    const name = (window.prompt('Template name:', '') || '').trim();
    if (!name) return;
    const t = loadTemplates();
    t[name] = {
      text: inputText.value, copies: copiesText.value, annexIndex: annexIndexText.value,
      settings: currentSettings()
    };
    saveTemplates(t);
    refreshTemplateList();
    selTemplate.value = name;
    showToast(`Template "${name}" saved`, '💾');
  });
  document.getElementById('btnApplyTemplate').addEventListener('click', () => {
    const name = selTemplate.value;
    const t = loadTemplates();
    if (!name || !t[name]) { showToast('No template selected', 'ℹ️'); return; }
    applyTemplateState(t[name]);
    showToast(`Template "${name}" applied`, '🗂️');
  });
  document.getElementById('btnDeleteTemplate').addEventListener('click', () => {
    const name = selTemplate.value;
    const t = loadTemplates();
    if (!name || !t[name]) { showToast('No template selected', 'ℹ️'); return; }
    delete t[name];
    saveTemplates(t);
    refreshTemplateList();
    showToast(`Template "${name}" deleted`, '🗑');
  });
  document.getElementById('btnNewLetter').addEventListener('click', () => {
    if (!window.confirm('Start a new blank letter? The current draft will be cleared (templates and settings are kept).')) return;
    inputText.value = '';
    copiesText.value = '';
    annexIndexText.value = '';
    annexSlots = [{ pages: [] }];
    renderAnnexSlots();
    try { localStorage.removeItem(LS_DRAFT); localStorage.removeItem(LS_DRAFT_ANNEX); } catch (e) { /* ignore */ }
    updateLetterStudio();
    showToast('New blank letter — start typing', '🧹');
  });

  // Backup / restore: one JSON file with everything stored on-device
  document.getElementById('btnBackup').addEventListener('click', () => {
    const data = { app: 'sinhala-letter-maker', version: 1 };
    [LS_DRAFT, LS_DRAFT_ANNEX, LS_SETTINGS, LS_TEMPLATES, 'awc_custom_signatures'].forEach(k => {
      try { const v = localStorage.getItem(k); if (v !== null) data[k] = v; } catch (e) { /* ignore */ }
    });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `letter-maker-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded', '⬇');
  });
  document.getElementById('btnRestore').addEventListener('click', () => restoreFile.click());
  restoreFile.addEventListener('change', () => {
    const file = restoreFile.files && restoreFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        [LS_DRAFT, LS_DRAFT_ANNEX, LS_SETTINGS, LS_TEMPLATES, 'awc_custom_signatures'].forEach(k => {
          if (typeof data[k] === 'string') localStorage.setItem(k, data[k]);
        });
        showToast('Backup restored — reloading…', '⬆');
        setTimeout(() => location.reload(), 600);
      } catch (e) {
        showToast('That file is not a valid backup', '⚠️');
      }
    };
    reader.readAsText(file);
    restoreFile.value = '';
  });

  // Share the DOCX straight to WhatsApp / email (Web Share API);
  // falls back to a download where file sharing is unavailable.
  btnShareDocx.addEventListener('click', async () => {
    const built = await buildLetterDocx(true);
    if (!built) return;
    const file = new File([built.blob], built.filename, {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: built.filename }); } catch (e) { /* cancelled */ }
    } else {
      const url = URL.createObjectURL(built.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = built.filename;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Sharing is not supported in this browser — DOCX downloaded instead', '📤');
    }
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

  copiesText.addEventListener('input', () => { updateLetterEnding(); saveDraft(); });
  annexIndexText.addEventListener('input', () => { updateLetterEnding(); saveDraft(); renderAnnexSlots(); });

  // Annexure slot file boxes (delegated: the boxes are re-rendered
  // whenever the annexure list changes).
  annexSlotsEl.addEventListener('change', (e) => {
    const inp = e.target.closest ? e.target.closest('[data-slot-file]') : null;
    if (!inp) return;
    const idx = parseInt(inp.dataset.slotFile, 10);
    const files = Array.from(inp.files || []);
    inp.value = '';
    if (files.length) addFilesToSlot(idx, files);
  });
  annexSlotsEl.addEventListener('click', (e) => {
    const btn = e.target.closest ? e.target.closest('[data-slot][data-page]') : null;
    if (!btn) return;
    const slot = annexSlots[parseInt(btn.dataset.slot, 10)];
    if (slot) slot.pages.splice(parseInt(btn.dataset.page, 10), 1);
    renderAnnexSlots();
    updateLetterEnding();
    saveDraft();
  });

  selLetterFont.addEventListener('change', () => {
    const chosen = selLetterFont.value;
    fontSelect.value = chosen;
    localStorage.setItem('sinhala_selected_font', chosen);
    updateLetterStudio();
    saveSettings();
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
  renderAnnexSlots();
  refreshTemplateList();

  // Restore the auto-saved draft + remembered settings; fall back
  // to the sample letter on a first visit.
  const hadDraft = restoreSavedState();
  if (!hadDraft) inputText.value = sampleComplaintLetter;
  updateLetterheadDesign();
  runConversion();
  loadEmbeddedFonts();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

})();
