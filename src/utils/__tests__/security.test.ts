import { describe, it, expect, beforeEach } from 'vitest';
import { 
  sanitizeInput, 
  isValidEmail, 
  isValidFileType, 
  isValidFileSize,
  generateSecureToken,
  ClientRateLimit 
} from '../security';

describe('Security utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('javascript:alert(1)')).toBe('alert(1)');
      expect(sanitizeInput('<img onerror="alert(1)" src="x">')).toBe('img src="x"');
    });

    it('should preserve safe content', () => {
      expect(sanitizeInput('Normal text content')).toBe('Normal text content');
      expect(sanitizeInput('Email: test@example.com')).toBe('Email: test@example.com');
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
    });
  });

  describe('file validation', () => {
    it('should validate file types', () => {
      const imageFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      
      expect(isValidFileType(imageFile, ['image/jpeg', 'image/png'])).toBe(true);
      expect(isValidFileType(pdfFile, ['image/jpeg', 'image/png'])).toBe(false);
    });

    it('should validate file sizes', () => {
      const smallFile = new File(['x'.repeat(100)], 'small.txt');
      const largeFile = new File(['x'.repeat(2000)], 'large.txt');
      
      expect(isValidFileSize(smallFile, 1000)).toBe(true);
      expect(isValidFileSize(largeFile, 1000)).toBe(false);
    });
  });

  describe('generateSecureToken', () => {
    it('should generate tokens of correct length', () => {
      expect(generateSecureToken(16)).toHaveLength(16);
      expect(generateSecureToken(32)).toHaveLength(32);
    });

    it('should generate unique tokens', () => {
      const token1 = generateSecureToken();
      const token2 = generateSecureToken();
      expect(token1).not.toBe(token2);
    });
  });

  describe('ClientRateLimit', () => {
    let rateLimit: ClientRateLimit;

    beforeEach(() => {
      rateLimit = new ClientRateLimit();
    });

    it('should allow requests within limit', () => {
      expect(rateLimit.isAllowed('user1', 3)).toBe(true);
      expect(rateLimit.isAllowed('user1', 3)).toBe(true);
      expect(rateLimit.isAllowed('user1', 3)).toBe(true);
    });

    it('should block requests over limit', () => {
      // Use up the limit
      for (let i = 0; i < 3; i++) {
        rateLimit.isAllowed('user1', 3);
      }
      // Next request should be blocked
      expect(rateLimit.isAllowed('user1', 3)).toBe(false);
    });

    it('should reset limits correctly', () => {
      // Use up the limit
      for (let i = 0; i < 3; i++) {
        rateLimit.isAllowed('user1', 3);
      }
      
      // Reset and try again
      rateLimit.reset('user1');
      expect(rateLimit.isAllowed('user1', 3)).toBe(true);
    });
  });
});