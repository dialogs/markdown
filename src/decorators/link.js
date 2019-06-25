/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import tlds from 'tlds';
import type { Decorator } from '../types';

const domains = new Set(tlds);
const pattern = /(?:\[(.+)\]\()?((?:(https?):\/\/)?(?:www\.)?(?:[-а-яёA-z0-9]+\.)+([а-яёA-z]{2,18})(?:[-А-яёA-z0-9._~:\/\?#\[\]@!$&'()\*\+,;=%]+)?)/gi;

function isPunctuation(char: string): boolean {
  return char === '.' || char === ',' || char === ':';
}

function indexOf(
  text: string,
  char: string,
  startIndex: number,
  endIndex: number,
): number {
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

export const link: Decorator = {
  name: 'link',
  strategy(text: string) {
    const ranges = [];

    let matches;
    for (
      let matches = pattern.exec(text);
      matches !== null;
      matches = pattern.exec(text)
    ) {
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
            url: protocol ? rawUrl : normalizeUrl(rawUrl),
          },
        });
      } else if (isPunctuation(lastLinkChar)) {
        ranges.push({
          start,
          end: end - 1,
          replace: link.slice(0, link.length - 1),
          ...(protocol
            ? {}
            : {
                options: {
                  url: normalizeUrl(link.slice(0, link.length - 1)),
                },
              }),
        });
      } else {
        ranges.push({
          start,
          end,
          replace: link,
          ...(protocol
            ? {}
            : {
                options: {
                  url: normalizeUrl(link),
                },
              }),
        });
      }
    }

    return ranges;
  },
};

export function getExpandedLink(newDomains: Array<string>): Decorator {
  if (newDomains && newDomains.length) {
    newDomains.forEach((newDomain: string) => {
      domains.add(newDomain);
    });
  }

  return link;
}
