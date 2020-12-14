/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import type { BlockToken, Decorator } from '../types';
import {
  isBlockquote,
  cleanBlockquote,
  cleanBlockquotes,
  isCodeStart,
  isEmptyCodeStart,
  cleanCodeStart,
  isCodeEnd,
  isEmptyCodeEnd,
  cleanCodeEnd,
  isListItem,
  parseListItem,
} from './utils';
import inline from './inline';

export type ParsingOptions = {
  maxParsingDepth: number,
};

function process(
  lines: Array<string>,
  decorators: Array<Decorator>,
  { maxParsingDepth }: ParsingOptions,
): Array<BlockToken> {
  const blocks = [];
  const nextOptions = { maxParsingDepth: maxParsingDepth - 1 };

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
        const clean = maxParsingDepth > 0 ? cleanBlockquote : cleanBlockquotes;

        blockquotes.push(clean(line));
      } else {
        break;
      }
    }

    if (blockquotes.length) {
      blocks.push({
        type: 'blockquote',
        content: process(blockquotes, decorators, nextOptions),
      });
    }

    // parse list
    const listItems = [];
    for (; i < lines.length; i++) {
      line = lines[i];
      if (isListItem(line)) {
        const { done, text: parsedLine } = parseListItem(line);
        listItems.push({ done, content: inline(parsedLine, decorators) });
      } else {
        break;
      }
    }

    if (listItems.length) {
      blocks.push({
        type: 'list',
        content: listItems,
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

function parse(
  text: string,
  decorators: Array<Decorator>,
  options: ParsingOptions = { maxParsingDepth: 0 },
): Array<BlockToken> {
  return process(text.split('\n'), decorators, options);
}

export default parse;
