import { ISingleRepository } from './ISingleRepository';

export type IChildSingleRepository<T = any> = {
  [key in keyof ISingleRepository<T>]: (parentId: string, ...base: Parameters<ISingleRepository<T>[key]>) => ReturnType<ISingleRepository<T>[key]>;
};
