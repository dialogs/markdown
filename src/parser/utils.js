/**
 * Copyright 2019 dialog LLC <info@dlg.im>
 * @flow strict
 */

export function isBlockquote(text: string): boolean {
  return /^\s*>/.test(text);
}

export function cleanBlockquote(text: string): string {
  return text.replace(/^\s*>\s*/, '');
}

export function isCodeStart(text: string): boolean {
  return /^```/.test(text);
}

export function isEmptyCodeStart(text: string): boolean {
  return /^```\s*$/.test(text);
}

export function cleanCodeStart(text: string): string {
  return text.replace(/^```/, '');
}

export function isCodeEnd(text: string): boolean {
  return /```$/.test(text);
}

export function isEmptyCodeEnd(text: string): boolean {
  return /^\s*```$/.test(text);
}

export function cleanCodeEnd(text: string): string {
  return text.replace(/```$/, '');
}

export function isListItem(text: string): boolean {
  return /^\s-\s/.test(text);
}

export function cleanListItem(text: string): string {
  return text.replace(/^\s-\s/, '');
}
