import multer, { MulterError } from 'multer';
import { type RequestHandler } from 'express';
import { ERROR_CODES, FILE_LIMITS, VERIFICATION_DOC_MIME_TYPES } from '@pidec/shared';
import { AppError } from '../../shared/errors/app-error.js';

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
