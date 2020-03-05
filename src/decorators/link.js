/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import tlds from 'tlds';
import type { Decorator } from '../types';
import memoize from 'lodash-es/memoize';

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

function createLinkStrategy(newDomains: Array<string>) {
  const domainsList = new Set(tlds);

  if (newDomains && newDomains.length) {
    newDomains.forEach((newDomain: string) => {
      domainsList.add(newDomain);
    });
  }

  const linkStrategy = memoize((text: string) => {
    const ranges = [];
    let matches = pattern.exec(text);

    if (matches) {
      for (matches; matches !== null; matches = pattern.exec(text)) {
        const [, name, url, protocol, domain] = matches;

        if (!domain && !domainsList.has(domain)) {
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
        const getRawUrl = () => link.slice(0, link.length - 1);

        if (name && lastLinkChar === ')') {
          const rawUrl = getRawUrl();

          ranges.push({
            start,
            end: end + name.length + 3,
            replace: name,
            options: {
              url: protocol ? rawUrl : normalizeUrl(rawUrl),
              raw: rawUrl,
            },
          });
        } else if (isPunctuation(lastLinkChar)) {
          const rawUrl = getRawUrl();

          ranges.push({
            start,
            end: end - 1,
            replace: rawUrl,
            ...(protocol
              ? {}
              : {
                  options: {
                    url: normalizeUrl(rawUrl),
                    raw: rawUrl,
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
                    raw: link,
                  },
                }),
          });
        }
      }
    }

    return ranges;
  });

  return linkStrategy;
}

export const link: Decorator = {
  name: 'link',
  strategy: createLinkStrategy([]),
};

export const textLink: Decorator = {
  name: 'textLink',
  strategy: createLinkStrategy([]),
};

export function getExpandedLink(newDomains: Array<string>): Decorator {
  return {
    name: 'link',
    strategy: createLinkStrategy(newDomains),
  };
}
