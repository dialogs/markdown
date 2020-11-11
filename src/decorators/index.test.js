/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 */

import {
  code,
  bold,
  italic,
  strike,
  email,
  link,
  mention,
  emoji,
  namedEmoji,
  getExpandedLink,
} from './index';

export function testDecorator(decorator, cases) {
  describe(decorator.name, () => {
    cases.forEach(({ text, result }) => {
      it(text, () => {
        expect(decorator.strategy(text)).toEqual(result);
      });
    });
  });
}

const longKibanaLink = `https://kibana.com/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:'logstash-*',interval:auto,query:(query_string:(analyze_wildcard:!t,query:'*')),sort:!('@timestamp',desc))`;
const longAmazonLink = `https://dialog-ee-desktop-beta.s3.amazonaws.com/dialog-ee-messenger-mac-canary.zip`;
const tldLongLink =
  'https://slack.engineering/highlights-from-slacks-august-mobile-meetup-405293bdf521';
const longLinkWithPort =
  'https://sandbox.dlg.im:8443/console/project/plat-01/browse/routes/[grpc-plat-01.apps.sandbox.dlg.im|http://grpc-plat-01.apps.sandbox.dlg.im/]';

describe('decorators', () => {
  testDecorator(code, [
    {
      text: '`code`',
      result: [{ start: 0, end: 6, replace: 'code' }],
    },
    {
      text: '`co`de`',
      result: [{ start: 0, end: 4, replace: 'co' }],
    },
  ]);

  testDecorator(bold, [
    {
      text: '*bold*',
      result: [{ start: 0, end: 6, replace: 'bold' }],
    },
    {
      text: '*bo*ld*',
      result: [],
    },
  ]);

  testDecorator(italic, [
    {
      text: '_italic_',
      result: [{ start: 0, end: 8, replace: 'italic' }],
    },
    {
      text: 'some_dashed_value',
      result: [],
    },
  ]);

  testDecorator(strike, [
    {
      text: '~strike~',
      result: [{ start: 0, end: 8, replace: 'strike' }],
    },
    {
      text: '~/react/~/fbjs',
      result: [],
    },
    {
      text: 'some~strike~value',
      result: [],
    },
  ]);

  testDecorator(email, [
    {
      text: 'foo@example.com',
      result: [{ start: 0, end: 15, replace: 'foo@example.com' }],
    },
    {
      text: 'Hello, (foo@bar.baz)',
      result: [{ start: 8, end: 19, replace: 'foo@bar.baz' }],
    },
  ]);

  testDecorator(link, [
    {
      text:
        'https://drive.google.com/open?id=1z2P7LcbkHHkMWVpmNa4PFqV2FfRkrFyLZ&authuser=s.schadnyh@dlg.im&usp=drive_fs',
      result: [
        {
          start: 0,
          end: 107,
          replace:
            'https://drive.google.com/open?id=1z2P7LcbkHHkMWVpmNa4PFqV2FfRkrFyLZ&authuser=s.schadnyh@dlg.im&usp=drive_fs',
        },
      ],
    },
    {
      text:
        'test it (https://drive.google.com/open?id=1z2P7LcbkHHkMWVpmNa4PFqV2FfRkrFyLZ&authuser=s.schadnyh@dlg.im&usp=drive_fs) text',
      result: [
        {
          start: 9,
          end: 116,
          replace:
            'https://drive.google.com/open?id=1z2P7LcbkHHkMWVpmNa4PFqV2FfRkrFyLZ&authuser=s.schadnyh@dlg.im&usp=drive_fs',
        },
      ],
    },
    {
      text: 'https://medium.com/@jfpetersphoto',
      result: [
        { start: 0, end: 33, replace: 'https://medium.com/@jfpetersphoto' },
      ],
    },
    {
      text: 'sometexthttps://medium.com/@jfpetersphoto',
      result: [
        { start: 8, end: 41, replace: 'https://medium.com/@jfpetersphoto' },
      ],
    },
    {
      text: 'document.doc',
      result: [],
    },
    {
      text: 'document.txt',
      result: [],
    },
    {
      text: 'document.pdf',
      result: [],
    },
    {
      text: 'document.png',
      result: [],
    },
    {
      text: 'document.exe',
      result: [],
    },
    {
      text: 'document.html',
      result: [],
    },
    {
      text: 'http://google.com',
      result: [{ start: 0, end: 17, replace: 'http://google.com' }],
    },
    {
      text: 'http://google.com, check this out: ',
      result: [{ start: 0, end: 17, replace: 'http://google.com' }],
    },
    {
      text: 'http://dialog.chat/ - test this',
      result: [{ start: 0, end: 19, replace: 'http://dialog.chat/' }],
    },
    {
      text: '(test: https://dlg.im)',
      result: [{ start: 7, end: 21, replace: 'https://dlg.im' }],
    },
    {
      text: '(https://dlg.im)',
      result: [{ start: 1, end: 15, replace: 'https://dlg.im' }],
    },
    {
      text: '(test: [Dialog](https://dlg.im))',
      result: [
        {
          start: 7,
          end: 31,
          replace: 'Dialog',
          options: { url: 'https://dlg.im' },
        },
      ],
    },
    {
      text: '[foo](https://foo.com) foo [foo](https://foo.com)',
      result: [
        {
          start: 0,
          end: '[foo](https://foo.com)'.length,
          replace: 'foo',
          options: { url: 'https://foo.com' },
        },
        {
          start: '[foo](https://foo.com) foo '.length,
          end: '[foo](https://foo.com) foo [foo](https://foo.com)'.length,
          replace: 'foo',
          options: { url: 'https://foo.com' },
        },
      ],
    },
    {
      text: '(test: https://dlg.im/foo(test))',
      result: [{ start: 7, end: 31, replace: 'https://dlg.im/foo(test)' }],
    },
    {
      text: longKibanaLink,
      result: [
        { start: 0, end: longKibanaLink.length, replace: longKibanaLink },
      ],
    },
    {
      text: longAmazonLink,
      result: [
        { start: 0, end: longAmazonLink.length, replace: longAmazonLink },
      ],
    },
    {
      text: tldLongLink,
      result: [{ start: 0, end: tldLongLink.length, replace: tldLongLink }],
    },
    {
      text: 'https://dlg.im/foo))hello',
      result: [{ start: 0, end: 25, replace: 'https://dlg.im/foo))hello' }],
    },
    {
      text: 'https://dlg.im/foo((hello',
      result: [{ start: 0, end: 25, replace: 'https://dlg.im/foo((hello' }],
    },
    {
      text: 'https://dlg.im/foohello))',
      result: [{ start: 0, end: 23, replace: 'https://dlg.im/foohello' }],
    },
    {
      text: 'You changed the group about to "https://dlg.im/en/"',
      result: [
        {
          start: 32,
          end: 32 + 'https://dlg.im/en/'.length,
          replace: 'https://dlg.im/en/',
        },
      ],
    },
    {
      text: 'You changed the group about to "https://a.yandex"',
      result: [
        {
          start: 32,
          end: 32 + 'https://a.yandex'.length,
          replace: 'https://a.yandex',
        },
      ],
    },
    {
      text: 'https://a.yandex',
      result: [
        {
          start: 0,
          end: 'https://a.yandex'.length,
          replace: 'https://a.yandex',
        },
      ],
    },
    {
      text: 'dlg.im',
      result: [
        {
          start: 0,
          end: 'dlg.im'.length,
          replace: 'dlg.im',
          options: { url: 'http://dlg.im' },
        },
      ],
    },
    {
      text: 'dlg.im/',
      result: [
        {
          start: 0,
          end: 'dlg.im/'.length,
          replace: 'dlg.im/',
          options: { url: 'http://dlg.im/' },
        },
      ],
    },
    {
      text: 'www.dlg.im',
      result: [
        {
          start: 0,
          end: 'www.dlg.im'.length,
          replace: 'www.dlg.im',
          options: { url: 'http://www.dlg.im' },
        },
      ],
    },
    {
      text: 'налог.рф',
      result: [
        {
          start: 0,
          end: 'налог.рф'.length,
          replace: 'налог.рф',
          options: { url: 'http://налог.рф' },
        },
      ],
    },
    {
      text: 'site.com/строчные_буквы',
      result: [
        {
          start: 0,
          end: 'site.com/строчные_буквы'.length,
          replace: 'site.com/строчные_буквы',
          options: { url: 'http://site.com/строчные_буквы' },
        },
      ],
    },
    {
      text: 'www.some-site.org/здесь_Заголовок',
      result: [
        {
          start: 0,
          end: 'www.some-site.org/здесь_Заголовок'.length,
          replace: 'www.some-site.org/здесь_Заголовок',
          options: { url: 'http://www.some-site.org/здесь_Заголовок' },
        },
      ],
    },
    {
      text: 'https://foo.com?bar=foo@bar.com&baz=bar',
      result: [
        {
          start: 0,
          end: 'https://foo.com?bar=foo@bar.com&baz=bar'.length,
          replace: 'https://foo.com?bar=foo@bar.com&baz=bar',
        },
      ],
    },
    {
      text: 'https://test.org/@foo.bar/baz',
      result: [
        {
          start: 0,
          end: 'https://test.org/@foo.bar/baz'.length,
          replace: 'https://test.org/@foo.bar/baz',
        },
      ],
    },
    {
      text: '(http://test.nonExistentDomain)',
      result: [],
    },
    {
      text:
        'https://www.figma.com/file/NFPgfTdDZxGndcYyxQ00RQ/03.-Android-–-Master?node-id=3898%3A42458',
      result: [
        {
          start: 0,
          end: 'https://www.figma.com/file/NFPgfTdDZxGndcYyxQ00RQ/03.-Android-–-Master?node-id=3898%3A42458'
            .length,
          replace:
            'https://www.figma.com/file/NFPgfTdDZxGndcYyxQ00RQ/03.-Android-–-Master?node-id=3898%3A42458',
        },
      ],
    },
    {
      text: longLinkWithPort,
      result: [
        {
          start: 0,
          end: longLinkWithPort.length,
          replace: longLinkWithPort,
        },
      ],
    },
  ]);

  testDecorator(getExpandedLink(['local']), [
    {
      text: 'http://gazprom.local, local link',
      result: [
        {
          start: 0,
          end: 20,
          replace: 'http://gazprom.local',
        },
      ],
    },
    {
      text: 'http://gazprom.local/адрес_по-русски, local link',
      result: [
        {
          start: 0,
          end: 36,
          replace: 'http://gazprom.local/адрес_по-русски',
        },
      ],
    },
  ]);

  testDecorator(mention, [
    {
      text: '@gusnkt',
      result: [{ start: 0, end: 7, replace: '@gusnkt' }],
    },
    {
      text: '(@gusnkt)',
      result: [{ start: 1, end: 8, replace: '@gusnkt' }],
    },
    {
      text: '@all',
      result: [{ start: 0, end: 4, replace: '@all' }],
    },
    {
      text: '@site.com',
      result: [{ start: 0, end: 9, replace: '@site.com' }],
    },
    {
      text: '@zs',
      result: [{ start: 0, end: 3, replace: '@zs' }],
    },
    {
      text: '@z',
      result: [{ start: 0, end: 2, replace: '@z' }],
    },
    {
      text: '@aaaa-1',
      result: [{ start: 0, end: 7, replace: '@aaaa-1' }],
    },
    {
      text: '@___aaaa__1-2',
      result: [{ start: 0, end: 13, replace: '@___aaaa__1-2' }],
    },
    {
      text: '@gusnkt?Test?',
      result: [{ start: 0, end: 7, replace: '@gusnkt' }],
    },
  ]);

  testDecorator(emoji, [
    {
      text: 'Hello, 😄!',
      result: [{ start: 7, end: 9, replace: '😄' }],
    },
    {
      text: 'Hey, 🤡',
      result: [{ start: 5, end: 7, replace: '🤡' }],
    },
  ]);
  testDecorator(namedEmoji, [
    {
      text: 'Hello, :smile:! :+1:',
      result: [
        { start: 7, end: 14, replace: '😄' },
        { start: 16, end: 20, replace: '👍' },
      ],
    },
    {
      text: 'Hey, :cop::skin-tone-4:',
      result: [{ start: 5, end: 23, replace: '👮🏽‍♂️' }],
    },
  ]);
});
