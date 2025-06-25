// Test setup file
import { jest } from '@jest/globals';

// Mock fetch globally
global.fetch = jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock window object
global.window = {
  chat_api_key: 'test-key',
  chat_api_tenant: 'test-tenant',
  personal_data: {},
  session_id: null,
  AltiusChatWidget: null,
};

// Mock document methods
global.document = {
  createElement: jest.fn(() => ({
    appendChild: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    classList: {
      add: jest.fn(),
      remove: jest.fn(),
      contains: jest.fn(),
    },
    style: {},
    textContent: '',
    innerHTML: '',
  })),
  head: {
    appendChild: jest.fn(),
  },
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn(),
  },
  readyState: 'complete',
  addEventListener: jest.fn(),
  getElementById: jest.fn(),
  querySelector: jest.fn(),
  querySelectorAll: jest.fn(() => []),
};

// Mock location
global.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
};

// Mock navigator
global.navigator = {
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  language: 'en-US',
  languages: ['en-US', 'en'],
}; 