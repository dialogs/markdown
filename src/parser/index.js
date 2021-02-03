/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import type { Decorator, BlockToken, TextToken } from '../types';

export type ParsingOptions = {
  maxParsingDepth: number,
};
declare export function parse(
  text: string,
  decorators: Array<Decorator>,
  options: ParsingOptions,
): Array<BlockToken>;

declare export function parseInline(
  text: string,
  decorators: Array<Decorator>,
): Array<TextToken>;
