/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import type { Decorator, Range } from '../types';

function identity<T>(value: T): T {
  return value;
}

export type RegexReplacer = (match: string) => string;

export function matchByRegex(
  regex: RegExp,
  text: string,
  replacer: RegexReplacer = identity,
): Array<Range> {
  const ranges = [];

  for (
    let matches = regex.exec(text);
    matches !== null;
    matches = regex.exec(text)
  ) {
    const full = matches[0];

    let start = matches.index;
    let end = start + full.length;

    if (matches.length === 2) {
      const part = matches[1];

      const startDiff = full.indexOf(part);
      start += startDiff;

      end -= full.length - (startDiff + part.length);
    }

    ranges.push({
      start,
      end,
      replace: replacer(text.slice(start, end)),
    });
  }

  return ranges;
}

export function createRegexDecorator(
  name: string,
  regex: RegExp,
  replacer?: RegexReplacer,
): Decorator {
  return {
    name,
    strategy(text) {
      return matchByRegex(regex, text, replacer);
    },
  };
}

export function matchBetweenChar(
  char: string,
  text: string,
  replace?: boolean,
): Array<Range> {
  const ranges = [];

  let start = 0;
  let end = 0;
  while (start >= 0 && start < text.length) {
    start = text.indexOf(char, start);
    if (start >= 0) {
      end = text.indexOf(char, start + 1);
      if (end > 0) {
        ranges.push({
          start,
          end: end + 1,
          replace: replace
            ? text.slice(start + 1, end)
            : text.slice(start, end + 1),
        });
        start = end + 1;
      } else {
        start = -1;
      }
    }
  }

  return ranges;
}

export function createBetweenDecorator(
  name: string,
  char: string,
  replace?: boolean,
): Decorator {
  return {
    name,
    strategy(text) {
      return matchBetweenChar(char, text, replace);
    },
  };
}
