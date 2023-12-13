import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';

@Injectable()
export class GetEntityService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public call = (path: string, id?: string) =>
    this.etcd
      .get(`${path}${id ? `/${id}` : ''}`)
      .json()
      .then((res: any) => res || null);
}
