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

    addFileBinary(name, uint8Arr) {
      this.files.push({
        name,
        data: uint8Arr,
        crc: crc32(uint8Arr),
        size: uint8Arr.length
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
      fontSizePt = 12,
      richLines = null,
      trailingLines = null,
      bodyAlign = 'both',
      letterheadImage = null,
      signatures = [],
      copies = [],
      annexIndex = [],
      annexures = []
    } = options;

    const szVal = Math.round((fontSizePt || 12) * 2); // 12pt = 24 half-points

    const zip = new SimpleZip();

    // Register images (letterhead, signatures, annexures) as media parts
    const imageParts = []; // { relId, fileName, data }
    let relCounter = 2; // rId1 is styles
    let imgCounter = 1;
    function registerImage(img) {
      if (!img || !img.data) return null;
      const ext = (img.ext || 'png').toLowerCase().replace('jpeg', 'jpg');
      const fileName = `media/image${imgCounter++}.${ext}`;
      const relId = `rId${relCounter++}`;
      imageParts.push({ relId, fileName, data: img.data });
      return relId;
    }
    const letterheadRel = letterheadImage ? registerImage(letterheadImage) : null;
    const signatureRels = signatures.map(s => registerImage(s));
    const annexureRels = annexures.map(a => registerImage(a));
    const hasImages = imageParts.length > 0;

    const imageDefaults = hasImages ? `
  <Default Extension="jpg" ContentType="image/jpeg"/>
  <Default Extension="png" ContentType="image/png"/>` : '';

    zip.addFile('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>${imageDefaults}
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`);

    zip.addFile('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`);

    const imageRels = imageParts.map(p => `
  <Relationship Id="${p.relId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${p.fileName}"/>`).join('');
    zip.addFile('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>${imageRels}
</Relationships>`);

    for (const part of imageParts) {
      zip.addFileBinary('word/' + part.fileName, part.data);
    }

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

    // --- Image drawing helpers ---
    let picIdCounter = 100;
    function inlineImageXml(relId, cx, cy) {
      const id = picIdCounter++;
      return `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${id}" name="Picture ${id}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="Picture ${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
    }

    function letterheadAnchorXml(relId) {
      const id = picIdCounter++;
      return `<w:p><w:pPr><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:drawing><wp:anchor distT="0" distB="0" distL="114300" distR="114300" simplePos="0" relativeHeight="251658242" behindDoc="1" locked="1" layoutInCell="1" allowOverlap="1"><wp:simplePos x="0" y="0"/><wp:positionH relativeFrom="page"><wp:posOffset>-41275</wp:posOffset></wp:positionH><wp:positionV relativeFrom="page"><wp:posOffset>-41275</wp:posOffset></wp:positionV><wp:extent cx="7550150" cy="10512410"/><wp:effectExtent l="0" t="0" r="0" b="3810"/><wp:wrapNone/><wp:docPr id="${id}" name="Letterhead"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id}" name="Letterhead"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="7550150" cy="10512410"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:anchor></w:drawing></w:r></w:p>`;
    }

    // Runs for a short line (signatory names, copies, headings), using the
    // same dual-font tokenisation as the body. Uses latinTokenRegex,
    // convertSinhalaFn, targetFont and szVal from the enclosing scope.
    function textRunsXml(text, bold = false, englishSpaces = false) {
      const bTag = bold ? '<w:b/>' : '';
      const mkRun = (t, font) => `<w:r><w:rPr><w:rFonts w:ascii="${escapeXml(font)}" w:hAnsi="${escapeXml(font)}" w:cs="${escapeXml(font)}"/>${bTag}<w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escapeXml(t)}</w:t></w:r>`;
      if (!text) return mkRun('', targetFont);
      // Copies / annexure lines: every space and every non-Sinhala
      // token is an Arial run; only Sinhala words use the legacy font.
      if (englishSpaces && preserveEnglish) {
        return text.split(/(\s+)/).map(part => {
          if (!part) return '';
          if (/^\s+$/.test(part)) return mkRun(' ', 'Arial');
          if (!/[\u0D80-\u0DFF]/.test(part)) return mkRun(part, 'Arial');
          return textRunsXml(part, bold, false);
        }).join('');
      }
      if (!preserveEnglish) {
        return mkRun(convertSinhalaFn ? convertSinhalaFn(text) : text, targetFont);
      }
      let out = '';
      let lastIdx = 0;
      let match;
      latinTokenRegex.lastIndex = 0;
      while ((match = latinTokenRegex.exec(text)) !== null) {
        if (match.index > lastIdx) {
          const sp = text.substring(lastIdx, match.index);
          out += mkRun(convertSinhalaFn ? convertSinhalaFn(sp) : sp, targetFont);
        }
        out += mkRun(match[0], 'Arial');
        lastIdx = match.index + match[0].length;
      }
      if (lastIdx < text.length) {
        const sp = text.substring(lastIdx);
        out += mkRun(convertSinhalaFn ? convertSinhalaFn(sp) : sp, targetFont);
      }
      return out || mkRun('', targetFont);
    }

    // Real letterhead artwork: full-page image anchored behind the text
    // on page 1 (same technique as Hugo's own Word letters), plus a
    // spacer so the body starts below the letterhead header zone.
    if (letterheadRel) {
      bodyXml += letterheadAnchorXml(letterheadRel);
      bodyXml += '<w:p><w:pPr><w:spacing w:before="2050" w:after="0"/></w:pPr></w:p>';
    }

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

    // Process lines: formatted (rich) lines from the Letter Studio, or
    // plain raw text lines when no rich content is supplied.
    const latinTokenRegex = /([A-Za-z0-9/&._-]*[A-Za-z][A-Za-z0-9/&._-]*(?:\s+[-–—]\s+[A-Za-z0-9/&._-]+|\s+[A-Za-z0-9/&._-]*[A-Za-z][A-Za-z0-9/&._-]*)*|[*•▪●○■◆◇►▸@#$%^&+=<>~_|\\\[\]{}]+)/g;
    function richLinesToXml(linesArr) {
      const jc = ['left', 'center', 'right', 'both'].includes(bodyAlign) ? bodyAlign : 'both';
      let out = '';
      for (const segs of linesArr) {
        if (segs && segs.pageBreak) {
          out += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
          continue;
        }
        if (!segs || !segs.length || !segs.some(s => (s.text || '').length)) {
          out += `<w:p><w:pPr><w:jc w:val="${jc}"/><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/></w:pPr></w:p>`;
          continue;
        }
        out += `<w:p><w:pPr><w:jc w:val="${jc}"/><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/></w:pPr>`;
        for (const s of segs) {
          if (!s.text) continue;
          const font = s.latin ? 'Arial' : targetFont;
          const fmt = `${s.bold ? '<w:b/>' : ''}${s.italic ? '<w:i/>' : ''}${s.underline ? '<w:u w:val="single"/>' : ''}`;
          out += `<w:r><w:rPr><w:rFonts w:ascii="${escapeXml(font)}" w:hAnsi="${escapeXml(font)}" w:cs="${escapeXml(font)}"/>${fmt}<w:sz w:val="${szVal}"/><w:szCs w:val="${szVal}"/></w:rPr><w:t xml:space="preserve">${escapeXml(s.text)}</w:t></w:r>`;
        }
        out += '</w:p>';
      }
      return out;
    }
    if (richLines) {
      bodyXml += richLinesToXml(richLines);
    } else {
    const lines = (rawText || '').split(/\r?\n/);

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
    }

    // Signatures grid (2 columns): signature image, dotted line, org, name
    if (signatures.length && signatureRels.length) {
      bodyXml += '<w:p><w:pPr><w:spacing w:before="360" w:after="0"/></w:pPr></w:p>';
      const cellW = 4513;
      const cellXml = (idx) => {
        if (idx >= signatures.length || !signatureRels[idx]) {
          return `<w:tc><w:tcPr><w:tcW w:w="${cellW}" w:type="dxa"/></w:tcPr><w:p/></w:tc>`;
        }
        const s = signatures[idx];
        let cx = 1872000;
        let cy = Math.round(cx * (s.h || 100) / (s.w || 200));
        if (cy > 1000000) {
          cy = 1000000;
          cx = Math.round(cy * (s.w || 200) / (s.h || 100));
        }
        return `<w:tc><w:tcPr><w:tcW w:w="${cellW}" w:type="dxa"/><w:tcMar><w:right><w:w w="180" w:type="dxa"/></w:right></w:tcMar></w:tcPr>` +
          `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>${inlineImageXml(signatureRels[idx], cx, cy)}</w:p>` +
          `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="40" w:after="80"/><w:pBdr><w:bottom w:val="dotted" w:sz="6" w:space="1" w:color="595959"/></w:pBdr></w:pPr></w:p>` +
          `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>${textRunsXml(s.org || '')}</w:p>` +
          `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>${textRunsXml(s.name || '')}</w:p>` +
          `</w:tc>`;
      };
      let rows = '';
      for (let i = 0; i < signatures.length; i += 2) {
        rows += `<w:tr>${cellXml(i)}${cellXml(i + 1)}</w:tr>`;
      }
      bodyXml += `<w:tbl><w:tblPr><w:tblW w:w="0" w:type="auto"/><w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="${cellW}"/><w:gridCol w:w="${cellW}"/></w:tblGrid>${rows}</w:tbl>`;
    }

    // Copies (පිටපත්) list
    if (copies.length) {
      bodyXml += `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="360" w:after="60"/></w:pPr>${textRunsXml('පිටපත්:', true)}</w:p>`;
      copies.forEach((line, i) => {
        bodyXml += `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>${textRunsXml(`${i + 1}. ${line}`, false, true)}</w:p>`;
      });
    }

    // Annexure index (ඇමිණුම්) list
    if (annexIndex.length) {
      bodyXml += `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="360" w:after="60"/></w:pPr>${textRunsXml('ඇමිණුම්:', true)}</w:p>`;
      annexIndex.forEach((line, i) => {
        bodyXml += `<w:p><w:pPr><w:jc w:val="left"/><w:spacing w:before="0" w:after="0"/></w:pPr>${textRunsXml(`${i + 1}. ${line}`, false, true)}</w:p>`;
      });
    }

    // Trailing sections (typed copies / annexure index) go after the
    // signature grid and the copies list, in the official order.
    if (trailingLines) {
      bodyXml += '<w:p><w:pPr><w:spacing w:before="240" w:after="0"/></w:pPr></w:p>';
      bodyXml += richLinesToXml(trailingLines);
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

    // Annexures: each on its own page, heading + full-width image
    annexures.forEach((a, i) => {
      const rel = annexureRels[i];
      if (!rel) return;
      let cx = 6120000;
      let cy = Math.round(cx * (a.h || 100) / (a.w || 100));
      if (cy > 8200000) {
        cy = 8200000;
        cx = Math.round(cy * (a.w || 100) / (a.h || 100));
      }
      bodyXml += `<w:p><w:pPr><w:pageBreakBefore/><w:jc w:val="left"/><w:spacing w:before="0" w:after="240"/></w:pPr>${textRunsXml(a.heading || '', true)}</w:p>`;
      bodyXml += `<w:p><w:pPr><w:jc w:val="center"/></w:pPr>${inlineImageXml(rel, cx, cy)}</w:p>`;
    });

    const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
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
