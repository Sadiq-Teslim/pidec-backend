import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { StageAdvancedPayload } from '../../../domain/services/email-service.js';

export const StageAdvancedEmail = ({
  recipientName,
  teamName,
  newStage,
  dashboardUrl,
}: StageAdvancedPayload) => (
  <EmailLayout preview={`${teamName} advances to Stage ${newStage}`}>
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      You're through to Stage {newStage}
    </Heading>
    <Text className="mt-4 text-grey-800">
      Congratulations {recipientName} — <strong>{teamName}</strong> has been selected to
      advance to <strong>Stage {newStage}</strong> of PIDEC 1.0.
    </Text>
    <Text className="mt-3 text-grey-800">
      The Stage {newStage} brief and submission window will appear on your dashboard. Get
      together with your team and start planning.
    </Text>
    <Button
      href={dashboardUrl}
      className="mt-6 inline-block rounded-md bg-gold-700 px-6 py-3 text-navy-900 font-medium no-underline"
    >
      Open dashboard
    </Button>
  </EmailLayout>
);

export default StageAdvancedEmail;
