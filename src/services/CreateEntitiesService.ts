import { uuid } from '@nmxjs/utils';
import { validate as validateUuid } from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';
import { ICreateEntityOptions, ICreateEntityResult } from '../interfaces';

@Injectable()
export class CreateEntitiesService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public async call(path: string, { payload }: ICreateEntityOptions): Promise<ICreateEntityResult> {
    let id = payload.id;

    if (!id || !validateUuid(id)) {
      id = uuid();
    }

    await this.etcd.put(`${path}/${id}`).value(
      JSON.stringify({
        id,
        ...payload,
      }),
    );
    return {
      id,
    };
  }
}
