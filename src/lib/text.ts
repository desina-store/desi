const DIACRITICS = /[\u064B-\u0652\u0670\u0640]/g;
const NON_WORD = /[^\p{L}\p{N}\s-]/gu;
const ARABIC_DIGITS = /[\u0660-\u0669\u06F0-\u06F9]/g;
const ARABIC_FOLDS: [RegExp, string][] = [
  [/[\u0623\u0625\u0622\u0671]/g, "\u0627"],
  [/[\u0649\u0626]/g, "\u064A"],
  [/\u0624/g, "\u0648"],
  [/\u0629/g, "\u0647"],
];

const DIGIT_MAP: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
};

export function normalizeText(value: string): string {
  let text = String(value ?? "").toLowerCase();
  text = text.replace(ARABIC_DIGITS, (digit) => DIGIT_MAP[digit] ?? digit);
  text = text.replace(DIACRITICS, "");
  for (const [pattern, replacement] of ARABIC_FOLDS) text = text.replace(pattern, replacement);
  return text.replace(NON_WORD, " ").replace(/\s+/g, " ").trim();
}

export const STOP_WORDS = new Set([
  "من", "في", "على", "عن", "الى", "الي", "مع", "هذا", "هذه", "ذلك", "التي", "الذي",
  "عايز", "عاوز", "محتاج", "ابغى", "اريد", "هل", "هو", "هي", "او", "و", "ال", "للمنتج",
  "the", "a", "an", "i", "want", "need", "for", "to", "is", "are", "do", "you", "have", "or", "of", "my",
]);

export function tokenize(value: string): string[] {
  const normalized = normalizeText(value);
  if (!normalized) return [];
  const tokens: string[] = [];
  for (const raw of normalized.split(" ")) {
    const token = raw.replace(/^-+|-+$/g, "");
    if (token.length < 2 || STOP_WORDS.has(token)) continue;
    tokens.push(token);
    // "السامسونج" should still match "سامسونج".
    if (token.length > 4 && token.startsWith("ال")) tokens.push(token.slice(2));
  }
  return tokens;
}
