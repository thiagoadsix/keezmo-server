import { describe, expect, it } from 'vitest';

import { generateId } from '@/shared/utils/generate-id';

describe('generateId', () => {
  it('should generate a valid UUID string', () => {
    const id = generateId();

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(id).toMatch(uuidRegex);
  });

  it('should generate unique IDs on successive calls', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();

    expect(id1).not.toBe(id2);
    expect(id1).not.toBe(id3);
    expect(id2).not.toBe(id3);
  });
});
