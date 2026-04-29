import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import { type ReactNode } from 'react';

/**
 * Shared email layout. Uses Tailwind via @react-email's bundled processor
 * so we avoid duplicating inline styles across templates. Brand colours
 * mirror the design system tokens (navy, gold, grey).
 */
export interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export const EmailLayout = ({ preview, children }: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Tailwind>
      <Body className="m-0 bg-white p-0 font-sans text-[16px] leading-[1.6] text-[#1A1A2E]">
        <Container className="mx-auto max-w-[560px] px-6 py-10">
          {/* Header */}
          <Section className="mb-6">
            <Text className="m-0 text-[20px] font-bold tracking-tight text-[#002868]">
              PIDEC 1.0
            </Text>
            <Text className="m-0 text-[12px] uppercase tracking-wider text-[#555577]">
              ULES Engineering Competition
            </Text>
          </Section>

          {/* Body */}
          <Section className="rounded-md border border-[#CCCCDD] bg-white p-8">{children}</Section>

          {/* Footer */}
          <Hr className="my-8 border-[#CCCCDD]" />
          <Section>
            <Text className="m-0 text-[12px] leading-[1.5] text-[#555577]">
              You're receiving this because you registered for PIDEC 1.0, the Prototype
              Inter-Departmental Engineering Challenge organised by the University of Lagos
              Engineering Society. Questions? Reply to this email.
            </Text>
            <Text className="mb-0 mt-3 text-[12px] text-[#555577]">
              © PIDEC 1.0 · ULES Competitions &amp; Technical Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
