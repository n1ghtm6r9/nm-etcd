import { ICreateSingleEntityOptions } from './ICreateSingleEntityOptions';

export interface ISingleRepository<T = any> {
  get(): Promise<T>;
  set(options: ICreateSingleEntityOptions<T>): Promise<boolean>;
  delete(): Promise<boolean>;
}
