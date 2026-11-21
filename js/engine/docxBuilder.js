// Zero-Dependency Client-Side .DOCX Generator for Sinhala & Mixed English Documents
(function(exports) {
  'use strict';

  // CRC32 Lookup Table
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[i] = c;
  }

  function crc32(uint8Arr) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < uint8Arr.length; i++) {
      crc = crcTable[(crc ^ uint8Arr[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  // Pure JavaScript ZIP Writer
  class SimpleZip {
    constructor() {
      this.files = [];
    }

    addFile(name, contentStr) {
      const encoder = new TextEncoder();
      const data = encoder.encode(contentStr);
      this.files.push({
        name,
        data,
        crc: crc32(data),
        size: data.length
      });
    }

    buildBlob() {
      const parts = [];
      let offset = 0;
      const cdHeaders = [];
      const encoder = new TextEncoder();

      for (const file of this.files) {
        const nameBuf = encoder.encode(file.name);
        const localHeader = new Uint8Array(30);
        const view = new DataView(localHeader.buffer);

        view.setUint32(0, 0x04034b50, true);
        view.setUint16(4, 20, true);
        view.setUint16(6, 0, true);
        view.setUint16(8, 0, true);
        view.setUint16(10, 0, true);
        view.setUint16(12, 0, true);
        view.setUint32(14, file.crc, true);
        view.setUint32(18, file.size, true);
        view.setUint32(22, file.size, true);
        view.setUint16(26, nameBuf.length, true);
        view.setUint16(28, 0, true);

        parts.push(localHeader, nameBuf, file.data);

        const cdEntry = new Uint8Array(46);
        const cdView = new DataView(cdEntry.buffer);
        cdView.setUint32(0, 0x02014b50, true);
        cdView.setUint16(4, 20, true);
        cdView.setUint16(6, 20, true);
        cdView.setUint16(8, 0, true);
        cdView.setUint16(10, 0, true);
        cdView.setUint16(12, 0, true);
        cdView.setUint16(14, 0, true);
        cdView.setUint32(16, file.crc, true);
        cdView.setUint32(20, file.size, true);
        cdView.setUint32(24, file.size, true);
        cdView.setUint16(28, nameBuf.length, true);
        cdView.setUint16(30, 0, true);
        cdView.setUint16(32, 0, true);
        cdView.setUint16(34, 0, true);
        cdView.setUint16(36, 0, true);
        cdView.setUint32(38, 0, true);
        cdView.setUint32(42, offset, true);

        cdHeaders.push(cdEntry, nameBuf);
        offset += localHeader.length + nameBuf.length + file.data.length;
      }

      const cdOffset = offset;
      let cdSize = 0;
      for (const h of cdHeaders) cdSize += h.length;

      const eocd = new Uint8Array(22);
      const eocdView = new DataView(eocd.buffer);
      eocdView.setUint32(0, 0x06054b50, true);
      eocdView.setUint16(4, 0, true);
      eocdView.setUint16(6, 0, true);
      eocdView.setUint16(8, this.files.length, true);
      eocdView.setUint16(10, this.files.length, true);
      eocdView.setUint32(12, cdSize, true);
      eocdView.setUint32(16, cdOffset, true);
      eocdView.setUint16(20, 0, true);

      return new Blob([...parts, ...cdHeaders, eocd], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
    }
  }

  function escapeXml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Build complete .docx document from text with dual-font preservation
  function buildDocx(rawText, options = {}) {
    const {
      targetFont = '4u-Bindumathi',
      preserveEnglish = true,
      headerTitle = '',
      headerSub = '',
      footerContact = '',
      convertSinhalaFn = null,
      fontSizePt = 12
    } = options;

    const szVal = Math.round((fontSizePt || 12) * 2); // 12pt = 24 half-points

    const zip = new SimpleZip();

    zip.addFile('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`);

    zip.addFile('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    zip.addFile('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`);

    zip.addFile('word/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="${escapeXml(targetFont)}" w:hAnsi="${escapeXml(targetFont)}" w:cs="${escapeXml(targetFont)}"/>
        <w:sz w:val="${szVal}"/>
        <w:szCs w:val="${szVal}"/>
      </w:rPr>
    </w:rPrDefault>
    <w:pPrDefault>
      <w:pPr>
        <w:jc w:val="both"/>
        <w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/>
      </w:pPr>
    </w:pPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:qFormat/>
    <w:pPr>
      <w:jc w:val="both"/>
      <w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/>
    </w:pPr>
    <w:rPr>
      <w:rFonts w:ascii="${escapeXml(targetFont)}" w:hAnsi="${escapeXml(targetFont)}" w:cs="${escapeXml(targetFont)}"/>
      <w:sz w:val="${szVal}"/>
      <w:szCs w:val="${szVal}"/>
    </w:rPr>
  </w:style>
</w:styles>`);

    let bodyXml = '';

    // Optional letterhead in DOCX
    if (headerTitle) {
      bodyXml += `<w:p>
        <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="60"/></w:pPr>
        <w:r>
          <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:b/><w:sz w:val="34"/><w:color w:val="0F172A"/></w:rPr>
          <w:t>${escapeXml(headerTitle)}</w:t>
        </w:r>
      </w:p>`;
      if (headerSub) {
        bodyXml += `<w:p>
          <w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="160"/><w:pBdr><w:bottom w:val="single" w:sz="12" w:space="8" w:color="0F172A"/></w:pBdr></w:pPr>
          <w:r>
            <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="18"/><w:color w:val="475569"/></w:rPr>
            <w:t>${escapeXml(headerSub)}</w:t>
          </w:r>
        </w:p>`;
      }
    }

    // Process lines
    const lines = (rawText || '').split(/\r?\n/);
    const latinTokenRegex = /([A-Za-z0-9/&._-]*[A-Za-z][A-Za-z0-9/&._-]*(?:\s+[-–—]\s+[A-Za-z0-9/&._-]+|\s+[A-Za-z0-9/&._-]*[A-Za-z][A-Za-z0-9/&._-]*)*|[*•▪●○■◆◇►▸@#$%^&+=<>~_|\\\[\]{}]+)/g;

    for (const line of lines) {
      // Space after paragraph removed: w:before="0" w:after="0", Justified: w:jc w:val="both"
      if (!line.trim()) {
        bodyXml += '<w:p><w:pPr><w:jc w:val="both"/><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/></w:pPr></w:p>';
        continue;
      }

      bodyXml += '<w:p><w:pPr><w:jc w:val="both"/><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/></w:pPr>';

      if (preserveEnglish) {
        let lastIdx = 0;
        let match;
        latinTokenRegex.lastIndex = 0;

        while ((match = latinTokenRegex.exec(line)) !== null) {
          if (match.index > lastIdx) {
            const sinhalaPart = line.substring(lastIdx, match.index);
            const converted = convertSinhalaFn ? convertSinhalaFn(sinhalaPart) : sinhalaPart;
            bodyXml += `<w:r><w:rPr><w:rFonts w:ascii="${escapeXml(targetFont)}" w:hAnsi="${escapeXml(targetFont)}" w:cs="${escapeXml(targetFont)}"/><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escapeXml(converted)}</w:t></w:r>`;
          }

          const englishPart = match[0];
          bodyXml += `<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial" w:cs="Arial"/><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escapeXml(englishPart)}</w:t></w:r>`;
          lastIdx = match.index + match[0].length;
        }

        if (lastIdx < line.length) {
          const sinhalaPart = line.substring(lastIdx);
          const converted = convertSinhalaFn ? convertSinhalaFn(sinhalaPart) : sinhalaPart;
          bodyXml += `<w:r><w:rPr><w:rFonts w:ascii="${escapeXml(targetFont)}" w:hAnsi="${escapeXml(targetFont)}" w:cs="${escapeXml(targetFont)}"/><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escapeXml(converted)}</w:t></w:r>`;
        }
      } else {
        const converted = convertSinhalaFn ? convertSinhalaFn(line) : line;
        bodyXml += `<w:r><w:rPr><w:rFonts w:ascii="${escapeXml(targetFont)}" w:hAnsi="${escapeXml(targetFont)}" w:cs="${escapeXml(targetFont)}"/><w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escapeXml(converted)}</w:t></w:r>`;
      }

      bodyXml += '</w:p>';
    }

    if (footerContact) {
      bodyXml += `<w:p>
        <w:pPr><w:jc w:val="center"/><w:spacing w:before="240" w:after="0"/><w:pBdr><w:top w:val="single" w:sz="6" w:space="8" w:color="F59E0B"/></w:pBdr></w:pPr>
        <w:r>
          <w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="18"/><w:color w:val="64748B"/></w:rPr>
          <w:t>${escapeXml(footerContact)}</w:t>
        </w:r>
      </w:p>`;
    }

    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

    zip.addFile('word/document.xml', docXml);
    return zip.buildBlob();
  }

  exports.buildDocx = buildDocx;

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.DocxBuilder = {}));
