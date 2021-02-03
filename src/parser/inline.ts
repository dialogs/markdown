/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 */

import type { TextToken, Range, Decorator } from '../types';

function process(
  tokens: Array<TextToken>,
  decorator: Decorator,
): Array<TextToken> {
  const result = [];
  for (const token of tokens) {
    if (!token.highlight) {
      // todo: check in dev mode, ranges are sorted
      const ranges = decorator.strategy(token.content);

      let last = 0;
      for (const { start, end, replace, options } of ranges) {
        if (start > last) {
          result.push({
            content: token.content.slice(last, start),
          });
        }

        result.push({
          options,
          content: replace || token.content.slice(start, end),
          highlight: decorator.name,
        });

        last = end;
      }

      if (last < token.content.length) {
        result.push({
          content: token.content.slice(last),
        });
      }
    } else {
      result.push(token);
    }
  }

  return result;
}

function parse(
  text: string,
  decorators: Array<Decorator> = [],
): Array<TextToken> {
  let tokens = [{ content: text }];

  for (const decorator of decorators) {
    tokens = process(tokens, decorator);
  }

  return tokens;
}

export default parse;
