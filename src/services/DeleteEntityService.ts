import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';

@Injectable()
export class DeleteEntityService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public call = (path: string, id?: string): Promise<boolean> =>
    this.etcd.kv
      .deleteRange({
        key: Buffer.from(`${path}${id ? `/${id}` : ''}`),
      })
      .then(res => parseInt(res.deleted) > 0);
}
