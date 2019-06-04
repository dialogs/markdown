/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import { detectEmoji, detectNamedEmoji } from '@dlghq/emoji';
import type { Decorator, Range } from '../types';

function convert(ranges): Array<Range> {
  const result = [];
  for (const { start, end, emoji } of ranges) {
    result.push(({ start, end, replace: emoji.char }: Range));
  }

  return result;
}

export const emoji: Decorator = {
  name: 'emoji',
  strategy(text: string) {
    return convert(detectEmoji(text));
  },
};

export const namedEmoji: Decorator = {
  name: 'emoji',
  strategy(text: string) {
    return convert(detectNamedEmoji(text));
  },
};
