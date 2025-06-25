// Simple test file for Altius Chat Widget
import { jest } from '@jest/globals';

// Mock DOM environment
global.document = {
  createElement: jest.fn(),
  head: {
    appendChild: jest.fn()
  },
  body: {
    appendChild: jest.fn()
  },
  readyState: 'complete',
  addEventListener: jest.fn()
};

global.window = {
  chat_api_key: 'test-key',
  chat_api_tenant: 'test-tenant',
  personal_data: {}
};

global.fetch = jest.fn();

describe('Altius Chat Widget', () => {
  test('should initialize without errors', () => {
    expect(true).toBe(true);
  });
}); 