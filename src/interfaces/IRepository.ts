import { Observable } from 'rxjs';
import { ICreateEntityOptions } from './ICreateEntityOptions';
import { ICreateEntityResult } from './ICreateEntityResult';
import { IUpdateEntityOptions } from './IUpdateEntityOptions';

export interface IRepository<T = any> {
  get(): Promise<T[]>;
  getOne(id: string): Promise<T>;
  create(options: ICreateEntityOptions<T>): Promise<ICreateEntityResult>;
  update(options: IUpdateEntityOptions<T>): Promise<boolean>;
  delete(id?: string): Promise<boolean>;
  watch(): Observable<T[]>;
}
