// Mixed Font Preservation & Dual-Font Formatter Engine
// Preserves English words, acronyms, and symbols (such as * mark, bullets, etc.) within Sinhala documents

(function(exports) {
  'use strict';

  // Tokenizer regex: matches English words, numbers, codes, or phrases with Latin characters,
  // as well as symbols and bullet marks: * • ▪ ● ○ ■ ◆ ◇ ► ▸ @ # $ % ^ & + = < > ~ _ | \ [ ] { }
  const LATIN_OR_SYMBOL_REGEX = /([A-Za-z0-9/&._-]*[A-Za-z][A-Za-z0-9/&._-]*(?:\s+[-–—]\s+[A-Za-z0-9/&._-]+|\s+[A-Za-z0-9/&._-]*[A-Za-z][A-Za-z0-9/&._-]*)*|[*•▪●○■◆◇►▸@#$%^&+=<>~_|\\\[\]{}]+)/g;

  function tokenizeText(text) {
    if (!text) return [];
    const parts = [];
    let lastIdx = 0;
    let match;

    LATIN_OR_SYMBOL_REGEX.lastIndex = 0;
    while ((match = LATIN_OR_SYMBOL_REGEX.exec(text)) !== null) {
      if (match.index > lastIdx) {
        parts.push({
          type: 'sinhala',
          text: text.substring(lastIdx, match.index)
        });
      }
      parts.push({
        type: 'english',
        text: match[0]
      });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < text.length) {
      parts.push({
        type: 'sinhala',
        text: text.substring(lastIdx)
      });
    }
    return parts;
  }

  function convertWithPreservation(text, targetType = 'fm', convertSinhalaFn) {
    if (!text) return { plainText: '', richHtml: '', englishTokens: [] };

    const parts = tokenizeText(text);
    const fontName = targetType === 'isi' ? 'IsiAbhaya, Isi, sans-serif' : '4u-Bindumathi, FM-Malithi, FM-Abhaya, sans-serif';
    const enFontName = 'Arial, Helvetica, sans-serif';

    let plainText = '';
    let richHtml = '';
    const englishTokens = [];

    parts.forEach(part => {
      if (part.type === 'english') {
        englishTokens.push(part.text);
        plainText += part.text;
        richHtml += `<span class="en-text" style="font-family: ${enFontName}; font-weight: inherit;">${escapeHtml(part.text)}</span>`;
      } else {
        const converted = convertSinhalaFn ? convertSinhalaFn(part.text) : part.text;
        plainText += converted;
        richHtml += `<span class="si-text" style="font-family: ${fontName}; font-weight: inherit;">${escapeHtml(converted)}</span>`;
      }
    });

    return {
      plainText,
      richHtml,
      englishTokens
    };
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  exports.tokenizeText = tokenizeText;
  exports.convertWithPreservation = convertWithPreservation;
  exports.LATIN_OR_SYMBOL_REGEX = LATIN_OR_SYMBOL_REGEX;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.MixedFontFormatter = {}));
