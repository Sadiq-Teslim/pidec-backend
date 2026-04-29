import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { FeedbackPublishedPayload } from '../../../domain/services/email-service.js';

export const FeedbackPublishedEmail = ({
  recipientName,
  teamName,
  stage,
  feedbackUrl,
}: FeedbackPublishedPayload) => (
  <EmailLayout preview={`Stage ${stage} feedback is ready for ${teamName}`}>
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      Your Stage {stage} feedback is ready
    </Heading>
    <Text className="mt-4 text-grey-800">
      Hi {recipientName}, the judges have completed Stage {stage} evaluations for{' '}
      <strong>{teamName}</strong>. You can review the score breakdown and per-criterion
      comments on your dashboard.
    </Text>
    <Button
      href={feedbackUrl}
      className="mt-6 inline-block rounded-md bg-navy-800 px-6 py-3 text-white font-medium no-underline"
    >
      View feedback
    </Button>
  </EmailLayout>
);

export default FeedbackPublishedEmail;
