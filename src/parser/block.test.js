/*
 * Copyright 2016 Dialog LLC <info@dlg.im>
 */

import parse from './block';

describe('block parsing', () => {
  const test = (text, result) => expect(parse(text)).toEqual(result);
  const tests = (texts, result) => texts.forEach((text) => test(text, result));

  it('should split text to paragraphs', () => {
    test('Hello, world', [
      {
        type: 'paragraph',
        content: [{ content: 'Hello, world' }],
      },
    ]);

    test('Hello, world\nHello, again', [
      {
        type: 'paragraph',
        content: [{ content: 'Hello, world' }],
      },
      {
        type: 'paragraph',
        content: [{ content: 'Hello, again' }],
      },
    ]);
  });

  it('should split text to blockquotes', () => {
    tests(
      ['> Hello, world', ' > Hello, world', ' >Hello, world'],
      [
        {
          type: 'blockquote',
          content: [
            {
              type: 'paragraph',
              content: [{ content: 'Hello, world' }],
            },
          ],
        },
      ],
    );
  });

  it('should split text to nested blockquotes', () => {
    tests(
      [
        '>> Hello, world',
        ' > > Hello, world',
        ' >> Hello, world',
        ' >>Hello, world',
        '>>Hello, world',
      ],
      [
        {
          type: 'blockquote',
          content: [
            {
              type: 'blockquote',
              content: [
                {
                  type: 'paragraph',
                  content: [{ content: 'Hello, world' }],
                },
              ],
            },
          ],
        },
      ],
    );
  });

  it('should correctly split blockquote and paragraph', () => {
    test('Hello, world\n> Some smart thoughts\nanother paragraph', [
      {
        type: 'paragraph',
        content: [{ content: 'Hello, world' }],
      },
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ content: 'Some smart thoughts' }],
          },
        ],
      },
      {
        type: 'paragraph',
        content: [{ content: 'another paragraph' }],
      },
    ]);
  });

  it('should split text to code-blocks', () => {
    tests(
      ['```test\ntest```', '```\ntest\ntest```', '```test\ntest\n```'],
      [
        {
          type: 'code_block',
          content: 'test\ntest',
        },
      ],
    );
  });

  it('should not drop unfinished code-blocks', () => {
    test('```', [
      {
        type: 'paragraph',
        content: [{ content: '```' }],
      },
    ]);
  });
});
