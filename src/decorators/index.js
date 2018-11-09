/*
 * Copyright 2016 Dialog LLC <info@dlg.im>
 * @flow
 */

import { link } from './link';
import { emoji, namedEmoji } from './emoji';
import { createRegexDecorator, createBetweenDecorator } from './utils';

export const code = createBetweenDecorator('code', '`', true);

export const bold = createRegexDecorator(
  'bold',
  /(?:^|[ .,#!$%^&;:{}=_`~()\/-])(\*[^*]+\*)(?:$|[ .,#!$%^&;:{}=_`~()\/-])/g,
  (match: string) => match.slice(1, match.length - 1)
);

export const italic = createRegexDecorator(
  'italic',
  /(?:^|[ .,#!$%^&*;:{}=`~()\/-])(_[^_]+_)(?:$|[ .,#!$%^&*;:{}=`~()\/-])/g,
  (match: string) => match.slice(1, match.length - 1)
);

export const strike = createRegexDecorator(
  'strike',
  /(?:^|[ .,#!$%^&*;:{}=_`()-])(~[^~]+~)(?:$|[ .,#!$%^&*;:{}=_`()-])/g,
  (match: string) => match.slice(1, match.length - 1)
);

export const mention = createRegexDecorator(
  'mention',
  /(?:^|[ .,#!$%^&*;:{}=_`~()\/-])(@(?:all|[a-z0-9_]{3,32}))/ig
);

export const email = createRegexDecorator(
  'email',
  /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g
);

const decorators = [
  code,
  link,
  bold,
  italic,
  strike,
  email,
  mention,
  emoji,
  namedEmoji
];

export {
  link,
  emoji,
  namedEmoji
};

export default decorators;
