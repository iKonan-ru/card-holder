import { type FC, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IPortalProps } from './model';
import { DEFAULT_CONTAINER_ID } from './lib';

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
