/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import type { Decorator } from '../types';

export type RegexReplacer = (match: string) => string;
declare export var code: Decorator;
declare export var bold: Decorator;
declare export var italic: Decorator;
declare export var strike: Decorator;
declare export var mention: Decorator;
declare export var email: Decorator;
declare export var link: Decorator;
declare export var textLink: Decorator;
declare export var emoji: Decorator;
declare export var namedEmoji: Decorator;

declare export function getExpandedLink(Array<string>): Decorator;
declare export function createRegexDecorator(
  name: string,
  regex: RegExp,
  replacer?: RegexReplacer,
): Decorator;

declare export function createBetweenDecorator(
  name: string,
  char: string,
  replace?: boolean,
): Decorator;

declare export var decorators: Array<Decorator>;
declare export default typeof decorators;
