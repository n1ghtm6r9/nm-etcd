import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';
import { ICreateSingleEntityOptions } from '../interfaces';

@Injectable()
export class CreateSingleEntityService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public call = (path: string, { payload }: ICreateSingleEntityOptions): Promise<boolean> =>
    this.etcd
      .put(`${path}`)
      .value(JSON.stringify(payload))
      .then(() => true);
}
