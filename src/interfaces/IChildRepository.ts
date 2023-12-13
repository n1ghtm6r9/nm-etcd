import { IRepository } from './IRepository';

export type IChildRepository<T = any> = {
  [key in keyof IRepository<T>]: (parentId: string, ...base: Parameters<IRepository<T>[key]>) => ReturnType<IRepository<T>[key]>;
};
