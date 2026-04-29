import { Button, Heading, Text } from '@react-email/components';
import { EmailLayout } from './_layout.js';

interface PasswordResetEmailProps {
  recipientName: string;
  resetLink: string;
}

export const PasswordResetEmail = ({ recipientName, resetLink }: PasswordResetEmailProps) => (
  <EmailLayout preview="Reset your PIDEC password">
    <Heading className="m-0 text-[24px] font-bold text-navy-900">Password Reset Request</Heading>
    <Text className="mt-4 text-grey-800">Hi {recipientName},</Text>
    <Text className="mt-3 text-grey-800">
      We received a request to reset your PIDEC password. Click the button below to set a new
      password:
    </Text>
    <Button
      href={resetLink}
      className="mt-6 inline-block rounded-md bg-navy-900 px-6 py-3 text-white font-medium no-underline"
    >
      Reset Password
    </Button>
    <Text className="mt-6 text-grey-700">Or copy this link in your browser:</Text>
    <Text className="mt-2 break-all rounded bg-grey-50 p-3 text-[12px] text-grey-600 font-mono">
      {resetLink}
    </Text>
    <div className="mt-6 rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-3">
      <Text className="m-0 text-[14px] text-yellow-900">
        ⏱️ This link expires in <strong>1 hour</strong>
      </Text>
    </div>
    <div className="mt-4 rounded-md border-l-4 border-red-400 bg-red-50 p-3">
      <Text className="m-0 text-[14px] text-red-900">
        ⚠️ If you did not request a password reset, you can safely ignore this email. Your account
        is secure.
      </Text>
    </div>
    <Text className="mt-6 text-[14px] text-grey-600">
      For security reasons, never share this link with anyone.
    </Text>
  </EmailLayout>
);

export default PasswordResetEmail;
