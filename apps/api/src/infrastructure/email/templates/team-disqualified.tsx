import { Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';
import type { TeamDisqualifiedPayload } from '../../../domain/services/email-service.js';

export const TeamDisqualifiedEmail = ({
  recipientName,
  teamName,
  stage,
  reason,
}: TeamDisqualifiedPayload) => (
  <EmailLayout preview={`Important notice for ${teamName}`}>
    <Heading className="m-0 text-[24px] font-bold text-navy-900">
      Important notice for your team
    </Heading>
    <Text className="mt-4 text-grey-800">
      Hi {recipientName}, we're writing to let you know that <strong>{teamName}</strong> has
      been disqualified at <strong>Stage {stage}</strong> of PIDEC 1.0.
    </Text>
    <Text className="mt-3 text-grey-800">
      Reason given by the Competitions &amp; Technical Team:
    </Text>
    <Text className="mt-2 rounded-md bg-grey-200/40 px-4 py-3 text-grey-800 italic">
      {reason}
    </Text>
    <Text className="mt-4 text-grey-800">
      You can still view your team's submissions and feedback from this stage on your
      dashboard. We appreciate the work you put in and hope to see you back for PIDEC 2.0.
    </Text>
  </EmailLayout>
);

export default TeamDisqualifiedEmail;
