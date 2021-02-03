/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import tlds from 'tlds';
import type { Decorator } from '../types';
import memoize from 'lodash-es/memoize';

const pattern = /(?:(?:\[(.+?)\])?\(((?:(https?):\/\/)?(?:www\.)?(?:[-а-яёA-z0-9]+?\.)+([а-яёA-z]{2,18})+(:\d{2,5})?(?:[?/#][-–А-яёA-z0-9._~:\/\?#\[|\]@!$&'()\*\+,;=%]*)?)\))|(?:((?:(https?):\/\/)?(?:www\.)?(?:[-а-яёA-z0-9]+?\.)+([а-яёA-z]{2,18})+(:\d{2,5})?(?:[?/#][-–А-яёA-z0-9._~:\/\?#\[|\]@!$&'()\*\+,;=%]*)?))/gi;

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
        let [
          ,
          name,
          url,
          protocol,
          domain,
          ,
          urlSimple,
          protocolSimple,
          domainSimple,
          ,
        ] = matches;

        if (urlSimple) {
          url = urlSimple;
          protocol = protocolSimple;
          domain = domainSimple;
        }

        if (!domain || !domainsList.has(domain)) {
          continue;
        }

        let link = url;
        const braceDepth = getBraceDepth(link);
        if (braceDepth > 0) {
          link = link.slice(0, link.length - braceDepth);
        }

        const start = urlSimple || name ? matches.index : matches.index + 1;
        const end = start + link.length;
        const lastLinkChar = link.charAt(link.length - 1);

        if (name) {
          ranges.push({
            start,
            end: end + name.length + (lastLinkChar === ')' ? 3 : 4),
            replace: name,
            options: {
              url: protocol ? link : normalizeUrl(link),
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
