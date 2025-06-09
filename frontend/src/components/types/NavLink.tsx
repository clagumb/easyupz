import type { ComponentChildren, JSX } from 'preact';
import { Link as PreactLink } from 'preact-router/match';

type Props = {
  href: string;
  children: ComponentChildren;
}  & JSX.HTMLAttributes<HTMLAnchorElement>;

const Link = PreactLink as unknown as (props: Props) => JSX.Element;

export function NavLink({ href, children }: Props) {
  return <Link href={href}>{children}</Link>;
}
