import { type FC, type PropsWithChildren, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { DEFAULT_CONTAINER_ID } from './lib';

interface IPortalProps extends PropsWithChildren {
  containerId?: string;
}

export const Portal: FC<IPortalProps> = ({
  children,
  containerId = DEFAULT_CONTAINER_ID,
}) => {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const existingContainer = document.getElementById(containerId);

    if (existingContainer) {
      setContainer(existingContainer);

      return;
    }

    const newContainer = document.createElement('div');
    newContainer.id = containerId;
    document.body.appendChild(newContainer);
    setContainer(newContainer);

    return () => {
      if (newContainer.parentNode) {
        newContainer.parentNode.removeChild(newContainer);
      }
    };
  }, [containerId]);

  if (!container) {
    return null;
  }

  return createPortal(children, container);
};
