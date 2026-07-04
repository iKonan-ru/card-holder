import { useCallback, useEffect, useMemo, type ReactElement } from 'react';
import { useFormContext, useModal } from '@shared/lib';
import type { Procedure } from '@shared/types';
import type { ISelectOption } from '@shared/ui';

export interface IUseDirectorySelectFieldParams<T extends { id: string }> {
  value: string;
  fieldName: string;
  items: T[];
  loadItems: Procedure;
  addItem: (name: string) => Promise<T>;
  updateItem: (item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getLabel: (item: T) => string;
  withLabel: (item: T, name: string) => T;
  createModalTitle: string;
  editModalTitle: string;
  renderCreateModal: (
    onSubmit: (name: string) => Promise<void>,
  ) => ReactElement;
  renderEditModal: (
    item: T,
    onSubmit: (name: string) => Promise<void>,
    onDelete: () => Promise<void>,
  ) => ReactElement;
}

export interface IUseDirectorySelectFieldResult {
  options: ISelectOption[];
  handleChange: (nextValue: string) => void;
  handleEditOption: (optionValue: string) => void;
  handleOpenCreate: Procedure;
}

// Общая CRUD-логика полей выбора «справочника» (тип карты, владелец):
// список опций, создание/редактирование/удаление через модалку, привязка к полю формы.
export const useDirectorySelectField = <T extends { id: string }>({
  value,
  fieldName,
  items,
  loadItems,
  addItem,
  updateItem,
  deleteItem,
  getLabel,
  withLabel,
  createModalTitle,
  editModalTitle,
  renderCreateModal,
  renderEditModal,
}: IUseDirectorySelectFieldParams<T>): IUseDirectorySelectFieldResult => {
  const { onChange } = useFormContext();
  const { open, close } = useModal();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const options = useMemo<ISelectOption[]>(
    () =>
      items
        .map((item) => ({ value: item.id, label: getLabel(item) }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [items, getLabel],
  );

  const handleChange = useCallback(
    (nextValue: string) => {
      onChange?.(fieldName, nextValue);
    },
    [onChange, fieldName],
  );

  const handleCreate = useCallback(
    async (name: string) => {
      // Не создаём дубль по имени (без учёта регистра) - вместо ошибки
      // молча выбираем уже существующий вариант, как будто пользователь
      // выбрал его из списка сам.
      const existingItem = items.find(
        (item) => getLabel(item).trim().toLowerCase() === name.toLowerCase(),
      );

      if (existingItem) {
        handleChange(existingItem.id);
        close();

        return;
      }

      const item = await addItem(name);
      handleChange(item.id);
      close();
    },
    [items, getLabel, addItem, handleChange, close],
  );

  const handleOpenCreate = useCallback(() => {
    open(renderCreateModal(handleCreate), createModalTitle);
  }, [open, renderCreateModal, handleCreate, createModalTitle]);

  const handleUpdate = useCallback(
    async (item: T, name: string) => {
      await updateItem(withLabel(item, name));
      close();
    },
    [updateItem, withLabel, close],
  );

  const handleDelete = useCallback(
    async (item: T) => {
      await deleteItem(item.id);

      if (value === item.id) {
        handleChange('');
      }

      close();
    },
    [deleteItem, value, handleChange, close],
  );

  const handleEditOption = useCallback(
    (optionValue: string) => {
      const item = items.find((current) => current.id === optionValue);

      if (!item) {
        return;
      }

      const handleSubmit = (name: string) => handleUpdate(item, name);
      const handleModalDelete = () => handleDelete(item);

      open(
        renderEditModal(item, handleSubmit, handleModalDelete),
        editModalTitle,
      );
    },
    [items, open, handleUpdate, handleDelete, renderEditModal, editModalTitle],
  );

  return { options, handleChange, handleEditOption, handleOpenCreate };
};
