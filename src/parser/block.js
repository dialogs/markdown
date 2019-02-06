/*
 * Copyright 2016 Dialog LLC <info@dlg.im>
 * @flow
 */

import type { BlockToken, Decorator } from '../types';
import {
  isBlockquote,
  cleanBlockquote,
  isCodeStart,
  isEmptyCodeStart,
  cleanCodeStart,
  isCodeEnd,
  isEmptyCodeEnd,
  cleanCodeEnd,
} from './utils';
import inline from './inline';

function process(lines: string[], decorators: Decorator[]): BlockToken[] {
  const blocks = [];
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // parse code blocks
    if (isCodeStart(line)) {
      const code = [];
      if (!isEmptyCodeStart(line)) {
        code.push(cleanCodeStart(line));
      }

      for (i++; i < lines.length; i++) {
        line = lines[i];
        if (isCodeEnd(line)) {
          if (!isEmptyCodeEnd(line)) {
            code.push(cleanCodeEnd(line));
          }

          break;
        }

        code.push(line);
      }

      if (code.length) {
        blocks.push({
          type: 'code_block',
          content: code.join('\n'),
        });

        continue;
      } else {
        i--;
      }
    }

    // parse blockquotes
    const blockquotes = [];
    for (; i < lines.length; i++) {
      line = lines[i];
      if (isBlockquote(line)) {
        blockquotes.push(cleanBlockquote(line));
      } else {
        break;
      }
    }

    if (blockquotes.length) {
      blocks.push({
        type: 'blockquote',
        content: process(blockquotes, decorators),
      });
    }

    if (i < lines.length) {
      blocks.push({
        type: 'paragraph',
        content: inline(line, decorators),
      });
    }
  }

  return blocks;
}

function parse(text: string, decorators: Decorator[]): BlockToken[] {
  return process(text.split('\n'), decorators);
}

export default parse;
