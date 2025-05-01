import { toHaveReceivedCommandTimes, toHaveReceivedCommandWith } from 'aws-sdk-client-mock-vitest';
import { expect } from 'vitest';

expect.extend({
  toHaveReceivedCommandTimes,
  toHaveReceivedCommandWith,
});
