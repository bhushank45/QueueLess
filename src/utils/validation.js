const domainPattern = /^(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,}$/i;

const commonProviderTypos = {
  "gamil.com": "gmail.com",
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cmo": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "hotnail.com": "hotmail.com",
};

export function getEmailValidationError(value) {
  const email = value.trim();
  const atIndex = email.indexOf("@");

  if (
    atIndex <= 0 ||
    atIndex !== email.lastIndexOf("@") ||
    email.length > 254
  ) {
    return "Enter a valid email address";
  }

  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1).toLowerCase();

  if (
    localPart.length > 64 ||
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !/^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(localPart) ||
    !domainPattern.test(domain)
  ) {
    return "Enter a valid email address";
  }

  const suggestedDomain = commonProviderTypos[domain];
  if (suggestedDomain) {
    return `Check the spelling. Did you mean ${localPart}@${suggestedDomain}?`;
  }

  return "";
}
