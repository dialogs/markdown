/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import { link, textLink, getExpandedLink } from './link';
import { emoji, namedEmoji } from './emoji';
import { createRegexDecorator, createBetweenDecorator } from './utils';

export const code = createBetweenDecorator('code', '`', true);

export const bold = createRegexDecorator(
  'bold',
  /(?:^|[ .,#!$%^&;:{}=_`~()\/-])(\*[^*]+\*)(?:$|[ .,#!$%^&;:{}=_`~()\/-])/g,
  (match: string) => match.slice(1, match.length - 1),
);

export const italic = createRegexDecorator(
  'italic',
  /(?:^|[ .,#!$%^&*;:{}=`~()\/-])(_[^_]+_)(?:$|[ .,#!$%^&*;:{}=`~()\/-])/g,
  (match: string) => match.slice(1, match.length - 1),
);

export const strike = createRegexDecorator(
  'strike',
  /(?:^|[ .,#!$%^&*;:{}=_`()-])(~[^~]+~)(?:$|[ .,#!$%^&*;:{}=_`()-])/g,
  (match: string) => match.slice(1, match.length - 1),
);

export const mention = createRegexDecorator(
  'mention',
  /(?:^|[ .,#!$%^&*;:{}=_`~()-])(@\b[^\s@()[\];:"\/\\,<>=]*\b)/gi,
);

export const email = createRegexDecorator(
  'email',
  /(?![^\s]*[=\/])(([^\/<>()\[\]\\.,;:\s@"]+(\.[^\/<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))(?![^\s]*[=\/])/g,
);

const decorators = [
  code,
  mention,
  email,
  bold,
  italic,
  strike,
  link,
  emoji,
  namedEmoji,
];

export { link, textLink, emoji, namedEmoji, getExpandedLink };

export default decorators;
