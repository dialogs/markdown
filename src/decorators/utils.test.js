/*
 * Copyright 2016 Dialog LLC <info@dlg.im>
 */

import { matchBetweenChar, matchByRegex } from './utils';

describe('decorators utils', () => {
  describe('matchBetweenChar', () => {
    it('should find and replace with char', () => {
      expect(matchBetweenChar('*', 'Hello *world*')).toEqual([
        { start: 6, end: 13, replace: '*world*' },
      ]);
    });

    it('should find and replace without char', () => {
      expect(matchBetweenChar('*', 'Hello *world*', true)).toEqual([
        { start: 6, end: 13, replace: 'world' },
      ]);
    });

    it('should find multiple', () => {
      expect(
        matchBetweenChar('*', 'Hello *world*. *How* are *you doing*?'),
      ).toEqual([
        { start: 6, end: 13, replace: '*world*' },
        { start: 15, end: 20, replace: '*How*' },
        { start: 25, end: 36, replace: '*you doing*' },
      ]);
    });
  });

  describe('matchByRegex', () => {
    it('should match by regex', () => {
      expect(matchByRegex(/[a-z]+/g, 'hello world')).toEqual([
        { start: 0, end: 5, replace: 'hello' },
        { start: 6, end: 11, replace: 'world' },
      ]);
    });

    it('should match by regex first group', () => {
      expect(matchByRegex(/ ([a-z]+)/g, 'hello world')).toEqual([
        { start: 6, end: 11, replace: 'world' },
      ]);

      expect(matchByRegex(/([a-z]+) /g, 'hello world')).toEqual([
        { start: 0, end: 5, replace: 'hello' },
      ]);

      expect(matchByRegex(/ ([a-z]+) /g, ' hello world')).toEqual([
        { start: 1, end: 6, replace: 'hello' },
      ]);
    });

    it('should use custom replacer', () => {
      expect(
        matchByRegex(/([a-z]+)/g, 'hello world', (match) => match.charAt(0)),
      ).toEqual([
        { start: 0, end: 5, replace: 'h' },
        { start: 6, end: 11, replace: 'w' },
      ]);
    });
  });
});
