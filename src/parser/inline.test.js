/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 */

import parse from './inline';
import decorators from '../decorators';

describe('inline parsing', () => {
  const test = (text, result) => expect(parse(text)).toEqual(result);
  const tests = (texts, result) => texts.forEach((text) => test(text, result));

  it('should convert text to token list', () => {
    expect(parse('Hello, world')).toEqual([
      {
        content: 'Hello, world',
      },
    ]);
  });

  it('should correctly split text using decorators', () => {
    const test = {
      name: 'test',
      strategy() {
        return [{ start: 2, end: 5 }, { start: 8, end: 10 }];
      },
    };

    expect(parse('0123456789', [test])).toEqual([
      {
        content: '01',
      },
      {
        content: '234',
        highlight: 'test',
      },
      {
        content: '567',
      },
      {
        content: '89',
        highlight: 'test',
      },
    ]);
  });

  it('should supports replace', () => {
    const test = {
      name: 'test',
      strategy() {
        return [
          { start: 2, end: 5, replace: 'hello' },
          { start: 8, end: 10, replace: 'world' },
        ];
      },
    };

    expect(parse('0123456789', [test])).toEqual([
      {
        content: '01',
      },
      {
        content: 'hello',
        highlight: 'test',
      },
      {
        content: '567',
      },
      {
        content: 'world',
        highlight: 'test',
      },
    ]);
  });

  it('should use decorators corect', () => {

    expect(parse('~test string example.com~', decorators)).toEqual([
      {
        content: 'test string example.com',
        highlight: 'strike',
        options: undefined,
      },
    ]);

    expect(parse('~ test string example.com ~', decorators)).toEqual([
      {
        content: ' test string example.com ',
        highlight: 'strike',
        options: undefined,
      },
    ]);

    expect(parse('*test string example.com*', decorators)).toEqual([
      {
        content: 'test string example.com',
        highlight: 'bold',
        options: undefined,
      },
    ]);

    expect(parse('* test string example.com *', decorators)).toEqual([
      {
        content: ' test string example.com ',
        highlight: 'bold',
        options: undefined,
      },
    ]);

    expect(parse('_test string example.com_', decorators)).toEqual([
      {
        content: 'test string example.com',
        highlight: 'italic',
        options: undefined,
      },
    ]);
    
    expect(parse('_ test string example.com _', decorators)).toEqual([
      {
        content: ' test string example.com ',
        highlight: 'italic',
        options: undefined,
      },
    ]);
  });
});
