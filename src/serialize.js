/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

import type { BlockToken } from './types';

declare export function serialize(tokens: Array<BlockToken>): string;

declare export default typeof serialize;
