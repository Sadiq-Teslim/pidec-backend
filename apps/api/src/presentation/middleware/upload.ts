import multer, { MulterError } from 'multer';
import { type RequestHandler } from 'express';
import { ERROR_CODES, FILE_LIMITS, VERIFICATION_DOC_MIME_TYPES } from '@pidec/shared';
import { AppError } from '../../shared/errors/app-error.js';

const detectMimeFromBuffer = (buffer: Buffer): (typeof VERIFICATION_DOC_MIME_TYPES)[number] | null => {
  if (buffer.length >= 4 && buffer.subarray(0, 4).equals(Buffer.from([0x25, 0x50, 0x44, 0x46]))) {
    return 'application/pdf';
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return 'image/png';
  }

  if (buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return 'image/jpeg';
  }

  return null;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: FILE_LIMITS.VERIFICATION_DOC_MAX_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!VERIFICATION_DOC_MIME_TYPES.includes(file.mimetype as (typeof VERIFICATION_DOC_MIME_TYPES)[number])) {
      cb(new AppError(ERROR_CODES.INVALID_FILE_TYPE, 'Only PDF, PNG, and JPG documents are allowed'));
      return;
    }
    cb(null, true);
  },
});

export const parseVerificationDocumentUpload: RequestHandler = (req, res, next) => {
  upload.single('document')(req, res, (err?: unknown) => {
    if (!err) {
      const file = (req as { file?: Express.Multer.File }).file;
      if (file?.buffer) {
        const detectedMime = detectMimeFromBuffer(file.buffer);
        if (!detectedMime || detectedMime !== file.mimetype) {
          next(
            new AppError(
              ERROR_CODES.INVALID_FILE_TYPE,
              'Verification document content does not match the declared file type',
            ),
          );
          return;
        }
      }

      next();
      return;
    }

    if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(ERROR_CODES.FILE_TOO_LARGE, 'Verification document must be 5MB or smaller'));
      return;
    }

    if (err instanceof AppError) {
      next(err);
      return;
    }

    next(new AppError(ERROR_CODES.VALIDATION_ERROR, 'Invalid verification document upload'));
  });
};
