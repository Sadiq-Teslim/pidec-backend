import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { VerificationFlaggedPayload } from '../../../domain/services/email-service.js';

export const VerificationFlaggedEmail = ({ recipientName, dashboardUrl }: VerificationFlaggedPayload) => (
  <EmailLayout preview="Manual review in progress for your PIDEC verification">
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      Verification flagged for manual review
    </Heading>
    <Text className="mt-4 text-grey-800">
      Hi {recipientName}, your document needs a closer look from our admin team. We'll get
      back to you within 24 hours.
    </Text>
    <Text className="mt-3 text-grey-800">
      You don't need to do anything right now. Once a decision is made, you'll receive
      another email and a notification on your dashboard.
    </Text>
    <Button
      href={dashboardUrl}
      className="mt-6 inline-block rounded-md bg-navy-800 px-6 py-3 text-white font-medium no-underline"
    >
      View status
    </Button>
  </EmailLayout>
);

export default VerificationFlaggedEmail;
