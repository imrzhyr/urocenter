import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
}

export const Portal = ({ children }: PortalProps) => {
  // Only create portal on client-side
  if (typeof document === 'undefined') return null;

  const portalRoot = document.getElementById('portal-root') || document.body;
  return createPortal(children, portalRoot);
};