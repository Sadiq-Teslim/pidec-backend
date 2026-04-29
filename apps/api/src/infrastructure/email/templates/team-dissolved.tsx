import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { TeamDissolvedPayload } from '../../../domain/services/email-service.js';

export const TeamDissolvedEmail = ({
  recipientName,
  teamName,
  dashboardUrl,
}: TeamDissolvedPayload) => (
  <EmailLayout preview={`${teamName} has been dissolved`}>
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      Your team has been dissolved
    </Heading>
    <Text className="mt-4 text-grey-800">
      Hi {recipientName}, the team <strong>{teamName}</strong> has been dissolved. You're
      now teamless and can create or join another team within your department, as long as
      team management is still unlocked.
    </Text>
    <Button
      href={dashboardUrl}
      className="mt-6 inline-block rounded-md bg-navy-800 px-6 py-3 text-white font-medium no-underline"
    >
      Go to your dashboard
    </Button>
  </EmailLayout>
);

export default TeamDissolvedEmail;
