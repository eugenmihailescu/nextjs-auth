'use client';

import Link from 'next/link';
import { Button } from '../ui/button';

interface LinkButtonProps {
  href: string;
  label: string;
}
/**
 * @description An authentication link button
 * @param {LinkButtonProps} { label, href }
 */
export const LinkButton = ({ label, href }: LinkButtonProps) => (
  <Button variant="link" className="w-full font-normal" size="sm" asChild>
    <Link href={href}>{label}</Link>
  </Button>
);
