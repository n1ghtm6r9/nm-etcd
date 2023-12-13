import { IRepository } from './IRepository';
import { IChildRepository } from './IChildRepository';
import { ISingleRepository } from './ISingleRepository';
import { ICreateChildRepositoryOptions } from './ICreateChildRepositoryOptions';

export interface IRepositoryFactoryService {
  create<T = any>(path: string): IRepository<T>;
  createSingle<T = any>(path: string): ISingleRepository<T>;
  createChild<T = any>(options: ICreateChildRepositoryOptions): IChildRepository<T>;
}
