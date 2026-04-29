import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { SubmissionConfirmedPayload } from '../../../domain/services/email-service.js';

export const SubmissionConfirmedEmail = ({
  recipientName,
  teamName,
  stage,
  submittedAt,
  dashboardUrl,
}: SubmissionConfirmedPayload) => (
  <EmailLayout preview={`Stage ${stage} submission received`}>
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      Stage {stage} submission received
    </Heading>
    <Text className="mt-4 text-grey-800">
      Hi {recipientName}, we've recorded the Stage {stage} submission for{' '}
      <strong>{teamName}</strong> at <strong>{submittedAt}</strong>. Your submission is now
      locked and under review.
    </Text>
    <Text className="mt-3 text-grey-800">
      You'll receive feedback once the judging window closes and admin publishes results.
    </Text>
    <Button
      href={dashboardUrl}
      className="mt-6 inline-block rounded-md bg-navy-800 px-6 py-3 text-white font-medium no-underline"
    >
      View submission
    </Button>
  </EmailLayout>
);

export default SubmissionConfirmedEmail;
