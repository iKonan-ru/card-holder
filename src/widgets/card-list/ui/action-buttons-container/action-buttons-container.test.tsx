import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ActionButtonsContainer } from './action-buttons-container';

describe('ActionButtonsContainer', () => {
  it('должен отрисовываться с children', () => {
    render(
      <ActionButtonsContainer>
        <button>Test Button</button>
      </ActionButtonsContainer>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });

    expect(button).toBeInTheDocument();
  });

  it('должен отрисовывать несколько children', () => {
    render(
      <ActionButtonsContainer>
        <button>Button 1</button>
        <button>Button 2</button>
        <button>Button 3</button>
      </ActionButtonsContainer>
    );

    expect(
      screen.getByRole('button', { name: 'Button 1' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Button 2' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Button 3' })
    ).toBeInTheDocument();
  });

  it('должен отрисовывать любые компоненты как children', () => {
    render(
      <ActionButtonsContainer>
        <div data-testid="test-div">Test Content</div>
        <span data-testid="test-span">Span Content</span>
      </ActionButtonsContainer>
    );

    expect(screen.getByTestId('test-div')).toBeInTheDocument();
    expect(screen.getByTestId('test-span')).toBeInTheDocument();
  });

  it('должен применять правильный класс контейнера', () => {
    const { container } = render(
      <ActionButtonsContainer>
        <button>Test Button</button>
      </ActionButtonsContainer>
    );

    const actionContainer = container.querySelector(
      '.action-buttons-container'
    );

    expect(actionContainer).toBeInTheDocument();
  });
});
