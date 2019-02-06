/*
 * Copyright 2016 Dialog LLC <info@dlg.im>
 * @flow
 */

import { detectEmoji, detectNamedEmoji } from '@dlghq/emoji';

function convert(ranges) {
  const result = [];
  for (const { start, end, emoji } of ranges) {
    result.push({ start, end, replace: emoji.char });
  }

  return result;
}

export const emoji = {
  name: 'emoji',
  strategy(text: string) {
    return convert(detectEmoji(text));
  },
};

export const namedEmoji = {
  name: 'emoji',
  strategy(text: string) {
    return convert(detectNamedEmoji(text));
  },
};
