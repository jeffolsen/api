export default function sortWord(word: string) {
  const numberMap = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine",
  };

  const numbersAsWords = word.replace(
    /[0-9]/g,
    (digit: string) => numberMap[digit as keyof typeof numberMap] || "",
  );

  return numbersAsWords
    .toLowerCase()
    .trim()
    .replace(/^(a|an|the)\s+/, "-")
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "-")
    .replace(/--+/g, "-");
}
