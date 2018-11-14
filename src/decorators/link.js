/*
 * Copyright 2016 Dialog LLC <info@dlg.im>
 * @flow
 */

import tlds from 'tlds';

const domains = new Set(tlds);
const pattern = /(?:\[(.+)\]\()?((?:(https?):\/\/)?(?:www\.)?[-а-яёa-z0-9]+\.([а-яёa-z]{2,6})(?:[-а-яёa-z0-9._~:\/\?#\[\]@!$&'()\*\+,;=%]+)?)/ig;

function isPunctuation(char: string): boolean {
  return char === '.' || char === ',' || char === ':';
}

function indexOf(text: string, char: string, startIndex: number, endIndex: number): number {
  for (let i = startIndex; i <= endIndex; i++) {
    if (text.charAt(i) === char) {
      return i;
    }
  }

  return -1;
}

function getBraceDepth(text: string): number {
  let depth = 0;
  let prevOpenIndex = 0;
  for (let i = text.length - 1; i >= 0; i--) {
    const char = text.charAt(i);
    if (char === ')') {
      const openIndex = indexOf(text, '(', prevOpenIndex + 1, i);
      if (openIndex === -1) {
        depth += 1;
      } else {
        prevOpenIndex = openIndex;
      }
    } else {
      break;
    }
  }

  return depth;
}

function normalizeUrl(url: string): string {
  return `http://${url}`;
}

export const link = {
  name: 'link',
  strategy(text: string) {
    const ranges = [];

    let matches;
    for (let matches = pattern.exec(text); matches !== null; matches = pattern.exec(text)) {
      const [, name, url, protocol, domain] = matches;

      if (!domains.has(domain)) {
        continue;
      }

      let link = url;
      const braceDepth = getBraceDepth(link);
      if (braceDepth > 0) {
        if (name) {
          link = link.slice(0, link.length - braceDepth + 1);
        } else {
          link = link.slice(0, link.length - braceDepth);
        }
      }

      const start = matches.index;
      const end = start + link.length;

      const lastLinkChar = link.charAt(link.length - 1);

      if (name && lastLinkChar === ')') {
        const rawUrl = link.slice(0, link.length - 1);

        ranges.push({
          start,
          end: end + name.length + 3,
          replace: name,
          options: {
            url: protocol ? rawUrl : normalizeUrl(rawUrl)
          }
        });
      } else if (isPunctuation(lastLinkChar)) {
        ranges.push({
          start,
          end: end - 1,
          replace: link.slice(0, link.length - 1),
          ...(protocol ? {} : {
            options: {
              url: normalizeUrl(link.slice(0, link.length - 1)),
            }
          })
        });
      } else {
        ranges.push({
          start,
          end,
          replace: link,
          ...(protocol ? {} : {
            options: {
              url: normalizeUrl(link),
            }
          })
        });
      }
    }

    return ranges;
  }
};
