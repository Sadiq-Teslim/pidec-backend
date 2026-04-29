import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { TeamInvitePayload } from '../../../domain/services/email-service.js';

export const TeamInviteEmail = ({
  recipientName,
  teamName,
  inviterName,
  expiresAt,
  invitesUrl,
}: TeamInvitePayload) => (
  <EmailLayout preview={`${teamName} wants you to join their PIDEC team`}>
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      You've been invited to join {teamName}
    </Heading>
    <Text className="mt-4 text-grey-800">
      Hi {recipientName}, <strong>{inviterName}</strong> has invited you to be part of their
      PIDEC 1.0 team. Accept or decline from your dashboard.
    </Text>
    <Text className="mt-3 text-grey-800">
      This invite expires on <strong>{expiresAt}</strong>. After that, the team leader will
      need to send a fresh invite.
    </Text>
    <Button
      href={invitesUrl}
      className="mt-6 inline-block rounded-md bg-gold-700 px-6 py-3 text-navy-900 font-medium no-underline"
    >
      Review invite
    </Button>
  </EmailLayout>
);

export default TeamInviteEmail;
