/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import type { BlockToken, TextToken } from './types';

function highlight(token: TextToken): string {
  switch (token.highlight) {
    case 'code': return `\`${token.content}\``;
    case 'bold': return `*${token.content}*`;
    case 'italic': return `_${token.content}_`;
    case 'strike': return `~${token.content}~`;
    case 'link': {
      const url = token.options && token.options.url;
      if (typeof url === 'string') {
        return `[${token.content}](${url})`;
      }

      return token.content;
    }
    default: return token.content;
  }
}

function serializeTextTokens(tokens: Array<TextToken>): string {
  const result = [];
  for (const token of tokens) {
    result.push(highlight(token));
  }

  return result.join('');
}

function serializeBlockTokens(tokens: Array<BlockToken>): Array<string> {
  const result = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'paragraph':
        result.push(serializeTextTokens(token.content));
        break;

      case 'code_block':
        result.push('```\n' + token.content + '\n```');
        break;

      case 'blockquote':
        for (const line of serializeBlockTokens(token.content)) {
          result.push(`> ${line}`);
        }
        break;

      case 'list':
        for (const item of token.content) {
          const content = serializeTextTokens(item.content);
          if (typeof item.done === 'boolean') {
            result.push(` - [${item.done ? 'x' : ' '}] ${content}`);
          } else {
            result.push(` - ${content}`);
          }
        }
        break;

      default:
        // do nothing
        break;
    }
  }

  return result;
}

function serialize(tokens: Array<BlockToken>): string {
  return serializeBlockTokens(tokens).join('\n');
}

export default serialize;
