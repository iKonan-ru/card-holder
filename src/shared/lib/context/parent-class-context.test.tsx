import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParentClassProvider, useParentClass } from './parent-class-context';

const TestComponent = () => {
  const parentClass = useParentClass();

  return <div data-testid="test">{parentClass || 'no-parent-class'}</div>;
};

describe('ParentClassContext', () => {
  it('должен возвращать undefined если нет провайдера', () => {
    render(<TestComponent />);
    expect(screen.getByTestId('test')).toHaveTextContent('no-parent-class');
  });

  it('должен возвращать parentClass из провайдера', () => {
    render(
      <ParentClassProvider parentClass="test-parent">
        <TestComponent />
      </ParentClassProvider>
    );
    expect(screen.getByTestId('test')).toHaveTextContent('test-parent');
  });

  it('должен работать с вложенными провайдерами', () => {
    const InnerComponent = () => {
      const parentClass = useParentClass();

      return <div data-testid="inner">{parentClass}</div>;
    };

    render(
      <ParentClassProvider parentClass="outer">
        <div data-testid="outer-content">outer</div>
        <ParentClassProvider parentClass="inner">
          <InnerComponent />
        </ParentClassProvider>
      </ParentClassProvider>
    );

    expect(screen.getByTestId('inner')).toHaveTextContent('inner');
  });

  it('должен возвращать undefined если parentClass не передан', () => {
    render(
      <ParentClassProvider>
        <TestComponent />
      </ParentClassProvider>
    );
    expect(screen.getByTestId('test')).toHaveTextContent('no-parent-class');
  });
});
