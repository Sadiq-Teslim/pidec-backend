import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';

interface VerificationEmailProps {
  recipientName: string;
  verificationLink: string;
}

export const VerificationEmail = ({ recipientName, verificationLink }: VerificationEmailProps) => (
  <EmailLayout preview="Verify your PIDEC email address">
    <Heading className="m-0 text-[24px] font-bold text-navy-900">Welcome to PIDEC</Heading>
    <Text className="mt-4 text-grey-800">Hi {recipientName},</Text>
    <Text className="mt-3 text-grey-800">
      Thank you for registering! Please verify your email address to complete your account setup.
    </Text>
    <Button
      href={verificationLink}
      className="mt-6 inline-block rounded-md bg-navy-900 px-6 py-3 text-white font-medium no-underline"
    >
      Verify Email Address
    </Button>
    <Text className="mt-6 text-grey-700">Or copy this link in your browser:</Text>
    <Text className="mt-2 break-all rounded bg-grey-50 p-3 text-[12px] text-grey-600 font-mono">
      {verificationLink}
    </Text>
    <div className="mt-6 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-3">
      <Text className="m-0 text-[14px] text-yellow-900">
        ⏱️ This link expires in <strong>24 hours</strong>
      </Text>
    </div>
    <Text className="mt-6 text-[14px] text-grey-600">
      If you didn't create this account, please ignore this email.
    </Text>
  </EmailLayout>
);

export default VerificationEmail;
