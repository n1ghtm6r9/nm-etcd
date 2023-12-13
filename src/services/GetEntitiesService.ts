import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';

@Injectable()
export class GetEntitiesService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public async call(path: string) {
    const depth = path.split('/').length + 1;

    const result = await this.etcd.getAll().prefix(path).json();

    return Object.entries(result).reduce((res, [key, value]) => {
      if (depth === key.split('/').length) {
        (<any[]>res).push(value);
      }
      return res;
    }, []);
  }
}
