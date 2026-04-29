import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { VerificationApprovedPayload } from '../../../domain/services/email-service.js';

export const VerificationApprovedEmail = ({ recipientName, dashboardUrl }: VerificationApprovedPayload) => (
  <EmailLayout preview="You're verified — welcome to PIDEC 1.0">
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      You're verified, {recipientName}
    </Heading>
    <Text className="mt-4 text-grey-800">
      Your engineering student status has been confirmed. You now have full access to your
      PIDEC 1.0 dashboard, where you can create or join a team and prepare for Stage 1.
    </Text>
    <Button
      href={dashboardUrl}
      className="mt-6 inline-block rounded-md bg-navy-800 px-6 py-3 text-white font-medium no-underline"
    >
      Go to your dashboard
    </Button>
    <Text className="mt-6 text-grey-600 text-[14px]">
      Team formation is open until Stage 1 submissions begin. Don't wait until the last day.
    </Text>
  </EmailLayout>
);

export default VerificationApprovedEmail;
