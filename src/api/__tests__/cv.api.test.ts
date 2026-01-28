import { describe, it, expect } from 'vitest';
import { cvApi } from '../cv.api';

describe('cvApi.validateFile', () => {
  /**
   * Helper to create mock File objects with configurable properties
   */
  const createMockFile = (
    name: string,
    size: number,
    type: string
  ): File => {
    const file = new File([''], name, { type });
    Object.defineProperty(file, 'size', { value: size, writable: false });
    return file;
  };

  const MB = 1024 * 1024;

  describe('File Size Validation', () => {
    it('accepts valid PDF under 3MB', () => {
      const validFile = createMockFile('cv.pdf', 2 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(validFile)).not.toThrow();
    });

    it('accepts PDF exactly at 1KB', () => {
      const smallFile = createMockFile('cv.pdf', 1024, 'application/pdf');
      expect(() => cvApi.validateFile(smallFile)).not.toThrow();
    });

    it('accepts PDF at edge case - exactly 3MB', () => {
      const edgeCaseFile = createMockFile('cv.pdf', 3 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(edgeCaseFile)).not.toThrow();
    });

    it('rejects file over 3MB', () => {
      const largeFile = createMockFile('cv.pdf', 4 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(largeFile)).toThrow('CV_FILE_TOO_LARGE');
    });

    it('rejects file slightly over 3MB (3MB + 1 byte)', () => {
      const slightlyOverFile = createMockFile('cv.pdf', 3 * MB + 1, 'application/pdf');
      expect(() => cvApi.validateFile(slightlyOverFile)).toThrow('CV_FILE_TOO_LARGE');
    });

    it('includes file size in error message', () => {
      const largeFile = createMockFile('cv.pdf', 5 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(largeFile)).toThrow(/5\.00MB/);
    });
  });

  describe('MIME Type Validation', () => {
    it('accepts application/pdf MIME type', () => {
      const pdfFile = createMockFile('document.pdf', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(pdfFile)).not.toThrow();
    });

    it('rejects application/msword (DOC) MIME type', () => {
      const docFile = createMockFile('cv.pdf', 1 * MB, 'application/msword');
      expect(() => cvApi.validateFile(docFile)).toThrow('CV_INVALID_FILE_TYPE');
    });

    it('rejects application/vnd.openxmlformats-officedocument.wordprocessingml.document (DOCX) MIME type', () => {
      const docxFile = createMockFile(
        'cv.pdf',
        1 * MB,
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(() => cvApi.validateFile(docxFile)).toThrow('CV_INVALID_FILE_TYPE');
    });

    it('rejects text/plain MIME type', () => {
      const textFile = createMockFile('cv.pdf', 1 * MB, 'text/plain');
      expect(() => cvApi.validateFile(textFile)).toThrow('CV_INVALID_FILE_TYPE');
    });

    it('rejects image/png MIME type', () => {
      const imageFile = createMockFile('cv.pdf', 1 * MB, 'image/png');
      expect(() => cvApi.validateFile(imageFile)).toThrow('CV_INVALID_FILE_TYPE');
    });

    it('rejects image/jpeg MIME type', () => {
      const jpegFile = createMockFile('cv.pdf', 1 * MB, 'image/jpeg');
      expect(() => cvApi.validateFile(jpegFile)).toThrow('CV_INVALID_FILE_TYPE');
    });

    it('rejects empty MIME type', () => {
      const noTypeFile = createMockFile('cv.pdf', 1 * MB, '');
      expect(() => cvApi.validateFile(noTypeFile)).toThrow('CV_INVALID_FILE_TYPE');
    });

    it('includes received MIME type in error message', () => {
      const docFile = createMockFile('cv.pdf', 1 * MB, 'application/msword');
      expect(() => cvApi.validateFile(docFile)).toThrow(/application\/msword/);
    });
  });

  describe('File Extension Validation', () => {
    it('accepts .pdf extension (lowercase)', () => {
      const pdfFile = createMockFile('document.pdf', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(pdfFile)).not.toThrow();
    });

    it('accepts .PDF extension (uppercase)', () => {
      const pdfFile = createMockFile('document.PDF', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(pdfFile)).not.toThrow();
    });

    it('accepts .Pdf extension (mixed case)', () => {
      const pdfFile = createMockFile('document.Pdf', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(pdfFile)).not.toThrow();
    });

    it('rejects .txt extension even with PDF MIME type', () => {
      const txtFile = createMockFile('cv.txt', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(txtFile)).toThrow('CV_INVALID_FILE_EXTENSION');
    });

    it('rejects .doc extension even with PDF MIME type', () => {
      const docFile = createMockFile('cv.doc', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(docFile)).toThrow('CV_INVALID_FILE_EXTENSION');
    });

    it('rejects .docx extension even with PDF MIME type', () => {
      const docxFile = createMockFile('cv.docx', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(docxFile)).toThrow('CV_INVALID_FILE_EXTENSION');
    });

    it('rejects file without extension even with PDF MIME type', () => {
      const noExtFile = createMockFile('cv', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(noExtFile)).toThrow('CV_INVALID_FILE_EXTENSION');
    });

    it('handles filenames with multiple dots', () => {
      const multiDotFile = createMockFile('my.curriculum.vitae.pdf', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(multiDotFile)).not.toThrow();
    });

    it('includes received extension in error message', () => {
      const txtFile = createMockFile('cv.txt', 1 * MB, 'application/pdf');
      expect(() => cvApi.validateFile(txtFile)).toThrow(/\.txt/);
    });
  });

  describe('Combined Validation Order', () => {
    it('checks size before MIME type - throws size error first', () => {
      const largeInvalidFile = createMockFile('cv.pdf', 5 * MB, 'text/plain');
      expect(() => cvApi.validateFile(largeInvalidFile)).toThrow('CV_FILE_TOO_LARGE');
    });

    it('checks MIME type before extension - throws MIME error second', () => {
      const invalidMimeFile = createMockFile('cv.txt', 1 * MB, 'text/plain');
      expect(() => cvApi.validateFile(invalidMimeFile)).toThrow('CV_INVALID_FILE_TYPE');
    });
  });
});
