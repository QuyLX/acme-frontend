import { missingKeys } from '@platform/i18n';
import { expect, test } from 'vitest';
import en from '../../messages/en.json';
import vi from '../../messages/vi.json';

test('vi and en have the same keys', () => expect(missingKeys({ vi, en })).toEqual([]));
