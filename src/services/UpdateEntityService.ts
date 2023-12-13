import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';
import { IUpdateEntityOptions } from '../interfaces';
import { GetEntityService } from './GetEntityService';

@Injectable()
export class UpdateEntityService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient, protected readonly getEntityService: GetEntityService) {}

  public async call(path: string, { id, payload }: IUpdateEntityOptions): Promise<boolean> {
    const current: any = await this.getEntityService.call(path, id);

    if (!current) {
      return false;
    }

    await this.etcd.put(`${path}/${id}`).value(
      JSON.stringify({
        ...current,
        ...payload,
      }),
    );

    return true;
  }
}
