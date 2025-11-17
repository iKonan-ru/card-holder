import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { SortableCardItem } from './sortable-card-item';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import type { FC, ReactNode } from 'react';

vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');

  return {
    ...actual,
    useSortable: vi.fn(() => ({
      attributes: {
        role: 'button',
        tabIndex: 0,
      },
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
      isDragging: false,
    })),
  };
});

const TEST_ID = 'test-item-1';
const TEST_CHILDREN = <div>Test Content</div>;

const DndWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <DndContext>
      <SortableContext items={[TEST_ID]}>{children}</SortableContext>
    </DndContext>
  );
};

describe('SortableCardItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('должна рендериться с children', () => {
    const { container } = render(
      <DndWrapper>
        <SortableCardItem
          id={TEST_ID}
          isReorderMode={false}
        >
          {TEST_CHILDREN}
        </SortableCardItem>
      </DndWrapper>
    );

    expect(container.querySelector('.sortable-card-item')).toBeInTheDocument();
    expect(container.textContent).toContain('Test Content');
  });

  it('должна применять transform из useSortable', () => {
    const { container } = render(
      <DndWrapper>
        <SortableCardItem
          id={TEST_ID}
          isReorderMode={false}
        >
          {TEST_CHILDREN}
        </SortableCardItem>
      </DndWrapper>
    );

    const wrapper = container.querySelector(
      '.sortable-card-item'
    ) as HTMLElement;

    expect(wrapper).toBeInTheDocument();
    expect(wrapper.style.transform).toBeDefined();
  });

  it('должна иметь базовый класс sortable-card-item', () => {
    const { container } = render(
      <DndWrapper>
        <SortableCardItem
          id={TEST_ID}
          isReorderMode={false}
        >
          {TEST_CHILDREN}
        </SortableCardItem>
      </DndWrapper>
    );

    const wrapper = container.querySelector('.sortable-card-item');
    expect(wrapper).toBeInTheDocument();
  });

  it('должна применять стили opacity', () => {
    const { container } = render(
      <DndWrapper>
        <SortableCardItem
          id={TEST_ID}
          isReorderMode={true}
        >
          {TEST_CHILDREN}
        </SortableCardItem>
      </DndWrapper>
    );

    const wrapper = container.querySelector(
      '.sortable-card-item'
    ) as HTMLElement;

    expect(wrapper.style.opacity).toBeDefined();
  });

  it('должна добавлять модификатор dragging при перетаскивании', async () => {
    const { useSortable } = await import('@dnd-kit/sortable');

    vi.mocked(useSortable).mockReturnValueOnce({
      attributes: {
        role: 'button',
        tabIndex: 0,
        'aria-disabled': false,
        'aria-pressed': undefined,
        'aria-roledescription': 'sortable',
        'aria-describedby': 'DndContext-0-description',
      },
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
      isDragging: true,
      node: { current: null },
      active: null,
      activeIndex: -1,
      index: 0,
      newIndex: 0,
      items: [],
      over: null,
      overIndex: -1,
      rect: { current: null },
      isSorting: false,
      setDroppableNodeRef: vi.fn(),
      setDraggableNodeRef: vi.fn(),
      data: {
        sortable: {
          containerId: 'test',
          items: [TEST_ID],
          index: 0,
        },
      },
      isOver: false,
      setActivatorNodeRef: vi.fn(),
    } as ReturnType<typeof useSortable>);

    const { container } = render(
      <DndWrapper>
        <SortableCardItem
          id={TEST_ID}
          isReorderMode={true}
        >
          {TEST_CHILDREN}
        </SortableCardItem>
      </DndWrapper>
    );

    const wrapper = container.querySelector('.sortable-card-item_dragging');
    expect(wrapper).toBeInTheDocument();
  });

  it('должна добавлять модификатор reorder в режиме переупорядочивания', () => {
    const { container } = render(
      <DndWrapper>
        <SortableCardItem
          id={TEST_ID}
          isReorderMode={true}
        >
          {TEST_CHILDREN}
        </SortableCardItem>
      </DndWrapper>
    );

    const wrapper = container.querySelector('.sortable-card-item_reorder');
    expect(wrapper).toBeInTheDocument();
  });
});
