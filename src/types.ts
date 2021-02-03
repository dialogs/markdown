/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 */

export type TokenOptions = { [key: string]: unknown };

export interface Range {
  start: number;
  end: number;
  replace?: string;
  options?: TokenOptions;
}

export interface Decorator {
  name: string;
  strategy(text: string): Array<Range>;
}

export interface TextToken {
  content: string;
  highlight?: Readonly<string>;
  options?: Readonly<TokenOptions>;
}

export interface ParagraphToken {
  type: 'paragraph';
  content: Array<TextToken>;
}

export interface CodeBlockToken {
  type: 'code_block';
  content: string;
}

export interface BlockquoteToken {
  type: 'blockquote';
  content: Array<BlockToken>;
}

export interface ListItem {
  done: boolean | void;
  content: Array<TextToken>;
}

export interface ListToken {
  type: 'list';
  content: Array<ListItem>;
}

export type BlockToken =
  | ParagraphToken
  | CodeBlockToken
  | BlockquoteToken
  | ListToken;
