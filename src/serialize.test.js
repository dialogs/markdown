/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 */

import fs from 'fs';
import path from 'path';
import { parse, serialize, decorators } from './index';

describe('parse -> serialize', () => {
  it('should be equal text after parse -> serialize', () => {
    const text = fs.readFileSync(path.join(__dirname, './__fixtures__/test.md'), 'utf-8');
    expect(serialize(parse(text, decorators))).toEqual(text);
  });
});
