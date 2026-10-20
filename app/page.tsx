import type { Metadata } from 'next';
import GiftExperience from '@/components/GiftExperience';
import config from '@/config';
import { normalize } from '@/lib/normalize';

export const metadata: Metadata = {
  title: config.text?.pageTitle ?? `${config.name}'s birthday gift`,
};

export default function Page() {
  return <GiftExperience config={normalize(config)} />;
}
