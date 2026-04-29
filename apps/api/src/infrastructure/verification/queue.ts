import Redis from 'ioredis';
import { Queue, Worker, type Job } from 'bullmq';
import { env } from '../../shared/config/env.js';
import { logger } from '../../shared/logger/index.js';

export interface VerificationJobPayload {
  userId: string;
  bufferKey: string;
  originalName: string;
  mimeType: string;
  size: number;
}

type Processor = (payload: VerificationJobPayload) => Promise<void>;

export class VerificationQueue {
  private readonly queueName = 'verification-doc-jobs';
  private readonly connection: Redis | null;
  private readonly queue: Queue<VerificationJobPayload> | null;
  private worker: Worker<VerificationJobPayload> | null = null;
  private processor: Processor | null = null;

  constructor() {
    try {
      this.connection = new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
      });
      this.queue = new Queue<VerificationJobPayload>(this.queueName, {
        connection: this.connection,
      });
    } catch (err) {
      logger.warn({ err }, 'Failed to initialize BullMQ queue; async verification will run inline');
      this.connection = null;
      this.queue = null;
    }
  }

  registerProcessor(processor: Processor): void {
    this.processor = processor;
    if (!this.connection || !this.queue || this.worker) return;

    this.worker = new Worker<VerificationJobPayload>(
      this.queueName,
      async (job: Job<VerificationJobPayload>) => {
        if (!this.processor) return;
        await this.processor(job.data);
      },
      {
        connection: this.connection,
        concurrency: 10,
      },
    );

    this.worker.on('error', (err) => {
      logger.error({ err }, 'Verification worker error');
    });
  }

  async enqueue(payload: VerificationJobPayload): Promise<void> {
    if (this.queue) {
      try {
        if (this.connection?.status === 'wait') await this.connection.connect();
        await this.queue.add('verify-doc', payload, {
          attempts: 2,
          removeOnComplete: 100,
          removeOnFail: 100,
          backoff: { type: 'exponential', delay: 1_000 },
        });
        return;
      } catch (err) {
        logger.warn({ err }, 'Verification queue enqueue failed; falling back to inline processing');
      }
    }

    if (this.processor) {
      setImmediate(() => {
        this.processor?.(payload).catch((err) => {
          logger.error({ err, payload }, 'Inline verification processing failed');
        });
      });
    }
  }
}

let cachedQueue: VerificationQueue | null = null;
export const getVerificationQueue = (): VerificationQueue => {
  if (cachedQueue) return cachedQueue;
  cachedQueue = new VerificationQueue();
  return cachedQueue;
};
