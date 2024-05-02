import { IRepository } from './IRepository';
import { IChildRepository } from './IChildRepository';
import { IChildSingleRepository } from './IChildSingleRepository';
import { ISingleRepository } from './ISingleRepository';
import { ICreateRepositoryOptions } from './ICreateRepositoryOptions';
import { ICreateChildRepositoryOptions } from './ICreateChildRepositoryOptions';

export interface IRepositoryFactoryService {
  create<T = any>(options: ICreateRepositoryOptions): IRepository<T>;
  createSingle<T = any>(options: ICreateRepositoryOptions): ISingleRepository<T>;
  createChild<T = any>(options: ICreateChildRepositoryOptions): IChildRepository<T>;
  createSingleChild<T = any>(options: ICreateChildRepositoryOptions): IChildSingleRepository<T>;
}
