import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const ROOT_ELEMENT_ID = 'root';

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

vi.mock('./app', () => ({
  App: () => null,
}));

describe('main', () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="${ROOT_ELEMENT_ID}"></div>`;
    vi.resetModules();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('должен найти root элемент и создать React приложение', async () => {
    const { createRoot } = await import('react-dom/client');

    await import('./main');

    const rootElement = document.getElementById(ROOT_ELEMENT_ID);
    expect(rootElement).toBeInTheDocument();
    expect(createRoot).toHaveBeenCalledWith(rootElement);
  });

  it('должен вызвать render с App компонентом', async () => {
    const renderMock = vi.fn();
    const createRootMock = vi.fn(() => ({
      render: renderMock,
    }));

    vi.doMock('react-dom/client', () => ({
      createRoot: createRootMock,
    }));

    await import('./main');

    expect(renderMock).toHaveBeenCalled();
  });
});
