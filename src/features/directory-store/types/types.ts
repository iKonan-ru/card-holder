export interface IDirectoryStoreState<T> {
  items: T[];
  isLoading: boolean;
}

export interface IDirectoryStoreActions<T> {
  load: () => Promise<void>;
  add: (label: string) => Promise<T>;
  update: (item: T) => Promise<void>;
  remove: (id: string) => Promise<void>;
  importItems: (items: T[]) => Promise<void>;
}

export interface IDirectoryStoreErrorMessages {
  load: string;
  add: string;
  update: string;
  remove: string;
  importItems: string;
}
