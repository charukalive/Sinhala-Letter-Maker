// Singlish Phonetic to Sinhala Unicode Engine
// Supports standard UCSC / Real-time Singlish scheme

const singlishVowels = [
    { s: 'aae', u: 'ඈ', p: 'ෑ' },
    { s: 'a\\\'', u: 'ඈ', p: 'ෑ' },
    { s: 'ae',  u: 'ඇ', p: 'ැ' },
    { s: 'aa',  u: 'ආ', p: 'ා' },
    { s: 'A',   u: 'ආ', p: 'ා' },
    { s: 'ii',  u: 'ඊ', p: 'ී' },
    { s: 'ee',  u: 'ඊ', p: 'ී' },
    { s: 'I',   u: 'ඊ', p: 'ී' },
    { s: 'i',   u: 'ඉ', p: 'ි' },
    { s: 'uu',  u: 'ඌ', p: 'ූ' },
    { s: 'oo',  u: 'ඌ', p: 'ූ' },
    { s: 'U',   u: 'ඌ', p: 'ූ' },
    { s: 'u',   u: 'උ', p: 'ු' },
    { s: 'ea',  u: 'ඒ', p: 'ේ' },
    { s: 'ei',  u: 'ඒ', p: 'ේ' },
    { s: 'E',   u: 'ඒ', p: 'ේ' },
    { s: 'e',   u: 'එ', p: 'ෙ' },
    { s: 'ai',  u: 'ඓ', p: 'ෛ' },
    { s: 'oe',  u: 'ඕ', p: 'ෝ' },
    { s: 'O',   u: 'ඕ', p: 'ෝ' },
    { s: 'o',   u: 'ඔ', p: 'ො' },
    { s: 'au',  u: 'ඖ', p: 'ෞ' },
    { s: 'ruu', u: 'ඎ', p: 'ෲ' },
    { s: 'ru',  u: 'ඍ', p: 'ෘ' },
    { s: 'a',   u: 'අ', p: '' }
];

const singlishConsonants = [
    { s: 'nndh', u: 'ඳ' },
    { s: 'nnd',  u: 'ඳ' },
    { s: 'nng',  u: 'ඟ' },
    { s: 'mmb',  u: 'ඹ' },
    { s: 'nnb',  u: 'ඹ' },
    { s: 'ksha', u: 'ක්‍ෂ' },
    { s: 'ksho', u: 'ක්‍ෂෝ' },
    { s: 'kshi', u: 'ක්‍ෂි' },
    { s: 'kshu', u: 'ක්‍ෂු' },
    { s: 'kse',  u: 'ක්‍ෂෙ' },
    { s: 'ksh',  u: 'ක්‍ෂ්' },
    { s: 'shh',  u: 'ෂ' },
    { s: 'Sh',   u: 'ෂ' },
    { s: 'sh',   u: 'ශ' },
    { s: 'ch',   u: 'ච' },
    { s: 'Ch',   u: 'ඡ' },
    { s: 'th',   u: 'ත' },
    { s: 'Th',   u: 'ථ' },
    { s: 'dh',   u: 'ද' },
    { s: 'Dh',   u: 'ධ' },
    { s: 'kn',   u: 'ඤ' },
    { s: 'gn',   u: 'ඥ' },
    { s: 'ph',   u: 'ඵ' },
    { s: 'bh',   u: 'භ' },
    { s: 'gh',   u: 'ඝ' },
    { s: 'jh',   u: 'ඣ' },
    { s: 'k',    u: 'ක' },
    { s: 'g',    u: 'ග' },
    { s: 't',    u: 'ට' },
    { s: 'T',    u: 'ඨ' },
    { s: 'd',    u: 'ඩ' },
    { s: 'D',    u: 'ඪ' },
    { s: 'n',    u: 'න' },
    { s: 'N',    u: 'ණ' },
    { s: 'p',    u: 'ප' },
    { s: 'P',    u: 'ඵ' },
    { s: 'b',    u: 'බ' },
    { s: 'B',    u: 'භ' },
    { s: 'm',    u: 'ම' },
    { s: 'y',    u: 'ය' },
    { s: 'r',    u: 'ර' },
    { s: 'l',    u: 'ල' },
    { s: 'L',    u: 'ළ' },
    { s: 'v',    u: 'ව' },
    { s: 'w',    u: 'ව' },
    { s: 's',    u: 'ස' },
    { s: 'h',    u: 'හ' },
    { s: 'f',    u: 'ෆ' },
    { s: 'j',    u: 'ජ' },
    { s: 'c',    u: 'ච' }
];

function singlishToUnicode(text) {
    if (!text) return '';
    let result = '';
    let i = 0;
    const len = text.length;

    while (i < len) {
        // Direct word-start abbreviations like 'sri' or 'shri' -> 'ශ්‍රී'
        if ((text.startsWith('sri ', i) || text.startsWith('sri\n', i) || (i + 3 === len && text.startsWith('sri', i)))) {
            result += 'ශ්‍රී';
            i += 3;
            continue;
        }
        if ((text.startsWith('shri ', i) || text.startsWith('shri\n', i) || (i + 4 === len && text.startsWith('shri', i)))) {
            result += 'ශ්‍රී';
            i += 4;
            continue;
        }

        // Check for anusvaraya (ng / ngg at end of syllable)
        if (text.substr(i, 2) === 'ng' && (i + 2 === len || !/[aeiouAEIOU]/.test(text[i + 2]))) {
            result += 'ං';
            i += 2;
            continue;
        }

        // Check if starts with a consonant
        let matchedConsonant = null;
        for (let c of singlishConsonants) {
            if (text.startsWith(c.s, i)) {
                matchedConsonant = c;
                break;
            }
        }

        if (matchedConsonant) {
            let advance = matchedConsonant.s.length;
            let cUnicode = matchedConsonant.u;

            // Check for Rakaransaya (consonant + r)
            let isRakaransaya = false;
            let isYansaya = false;

            if (text[i + advance] === 'r' && matchedConsonant.s !== 'r') {
                isRakaransaya = true;
                advance += 1;
            } else if (text[i + advance] === 'y' && matchedConsonant.s !== 'y') {
                isYansaya = true;
                advance += 1;
            }

            // Check following vowel
            let matchedVowel = null;
            for (let v of singlishVowels) {
                if (text.startsWith(v.s, i + advance)) {
                    matchedVowel = v;
                    break;
                }
            }

            if (matchedVowel) {
                advance += matchedVowel.s.length;
                let base = cUnicode;
                if (isRakaransaya) {
                    base = base + '්‍ර';
                } else if (isYansaya) {
                    base = base + '්‍ය';
                }
                result += base + matchedVowel.p;
            } else {
                // No vowel follows -> hal kirima (virama ්)
                let base = cUnicode;
                if (isRakaransaya) {
                    base = base + '්‍ර';
                } else if (isYansaya) {
                    base = base + '්‍ය';
                }
                result += base + '්';
            }
            i += advance;
            continue;
        }

        // Check if starts with an independent vowel
        let matchedIndependentVowel = null;
        for (let v of singlishVowels) {
            if (text.startsWith(v.s, i)) {
                matchedIndependentVowel = v;
                break;
            }
        }

        if (matchedIndependentVowel) {
            result += matchedIndependentVowel.u;
            i += matchedIndependentVowel.s.length;
            continue;
        }

        // Any other characters (spaces, punctuation, numbers)
        result += text[i];
        i++;
    }

    // Clean up
    result = result.replace(/්්/g, '්');
    result = result.replace(/ශ්‍රීී/g, 'ශ්‍රී');

    return result;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { singlishToUnicode };
}
