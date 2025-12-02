import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { Portal } from './portal';

const PORTAL_CONTENT_TEXT = 'Portal Content';
const DEFAULT_CONTAINER_ID = 'modal-root';
const CUSTOM_CONTAINER_ID = 'custom-portal';

describe('Portal', () => {
  afterEach(() => {
    const defaultContainer = document.getElementById(DEFAULT_CONTAINER_ID);
    const customContainer = document.getElementById(CUSTOM_CONTAINER_ID);

    if (defaultContainer) {
      defaultContainer.remove();
    }

    if (customContainer) {
      customContainer.remove();
    }
  });

  it('должен рендерить содержимое в portal контейнер', () => {
    render(
      <Portal>
        <div>{PORTAL_CONTENT_TEXT}</div>
      </Portal>
    );

    expect(screen.getByText(PORTAL_CONTENT_TEXT)).toBeInTheDocument();

    const container = document.getElementById(DEFAULT_CONTAINER_ID);
    expect(container).toBeInTheDocument();
  });

  it('должен использовать кастомный containerId', () => {
    render(
      <Portal containerId={CUSTOM_CONTAINER_ID}>
        <div>{PORTAL_CONTENT_TEXT}</div>
      </Portal>
    );

    const container = document.getElementById(CUSTOM_CONTAINER_ID);
    expect(container).toBeInTheDocument();
    expect(container).toContainHTML(PORTAL_CONTENT_TEXT);
  });

  it('должен использовать существующий контейнер если он уже есть', () => {
    const existingContainer = document.createElement('div');
    existingContainer.id = DEFAULT_CONTAINER_ID;
    document.body.appendChild(existingContainer);

    render(
      <Portal>
        <div>{PORTAL_CONTENT_TEXT}</div>
      </Portal>
    );

    const containers = document.querySelectorAll(`#${DEFAULT_CONTAINER_ID}`);
    expect(containers).toHaveLength(1);
  });

  it('должен удалить контейнер после размонтирования', () => {
    const { unmount } = render(
      <Portal>
        <div>{PORTAL_CONTENT_TEXT}</div>
      </Portal>
    );

    const containerBeforeUnmount =
      document.getElementById(DEFAULT_CONTAINER_ID);
    expect(containerBeforeUnmount).toBeInTheDocument();

    unmount();

    const containerAfterUnmount = document.getElementById(DEFAULT_CONTAINER_ID);
    expect(containerAfterUnmount).not.toBeInTheDocument();
  });
});
