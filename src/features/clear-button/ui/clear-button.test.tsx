import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as cardManagementModule from '@features/card-management';
import type { ICardsActions, ICardsState } from '@features/card-management';
import * as hooks from '../hooks';
import { ClearButton } from './clear-button';

vi.mock('@features/card-management');
vi.mock('../hooks');

describe('ClearButton', () => {
  const mockClearAllCards = vi.fn();
  const mockClearData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(cardManagementModule.useCardsStore).mockImplementation(
      (selector) => {
        const state: ICardsState & ICardsActions = {
          cards: [],
          flippedPan: null,
          isLoading: false,
          isReorderMode: false,
          flipCard: vi.fn(),
          unflipCards: vi.fn(),
          loadCards: vi.fn(),
          addCard: vi.fn(),
          updateCard: vi.fn(),
          deleteCard: vi.fn(),
          clearAllCards: mockClearAllCards,
          reorderCards: vi.fn(),
          setCards: vi.fn(),
          setReorderMode: vi.fn(),
          toggleReorderMode: vi.fn(),
        };

        return selector(state);
      },
    );

    vi.mocked(hooks.useClearData).mockReturnValue({
      isClearing: false,
      clearData: mockClearData,
    });
  });

  it('должна рендериться', () => {
    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    expect(button).toBeInTheDocument();
  });

  it('должна иметь правильный aria-label', () => {
    render(<ClearButton />);

    const button = screen.getByLabelText('Очистить все данные');

    expect(button).toBeInTheDocument();
  });

  it('должна вызывать clearData при клике', async () => {
    const user = userEvent.setup();

    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    await user.click(button);

    expect(mockClearData).toHaveBeenCalledOnce();
  });

  it('должна передавать clearAllCards в useClearData', () => {
    render(<ClearButton />);

    expect(hooks.useClearData).toHaveBeenCalledWith({
      onClear: mockClearAllCards,
    });
  });

  it('должна быть отключена во время очистки', () => {
    vi.mocked(hooks.useClearData).mockReturnValue({
      isClearing: true,
      clearData: mockClearData,
    });

    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    expect(button).toBeDisabled();
  });

  it('не должна быть отключена по умолчанию', () => {
    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    expect(button).not.toBeDisabled();
  });

  it('должна отображать иконку MdDeleteForever', () => {
    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    const icon = button.querySelector('svg');

    expect(icon).toBeInTheDocument();
  });

  it('не должна вызывать clearData при клике если disabled', async () => {
    vi.mocked(hooks.useClearData).mockReturnValue({
      isClearing: true,
      clearData: mockClearData,
    });

    const user = userEvent.setup();

    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    await user.click(button);

    expect(mockClearData).not.toHaveBeenCalled();
  });

  it('должна использовать FabButton компонент', () => {
    render(<ClearButton />);

    const button = screen.getByRole('button', {
      name: /очистить все данные/i,
    });

    expect(button).toHaveClass('fab-button');
  });
});
