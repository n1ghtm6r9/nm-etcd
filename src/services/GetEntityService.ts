import { NotFoundError } from '@nmxjs/errors';
import { Inject, Injectable } from '@nestjs/common';
import { IEtcdClient, IGetOneEntityOptions } from '../interfaces';
import { etcdClientKey } from '../constants';

@Injectable()
export class GetEntityService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public call = (entityName: string, path: string, idOrOptions?: string | IGetOneEntityOptions) =>
    this.etcd
      .get(`${path}${idOrOptions ? `/${typeof idOrOptions === 'object' ? idOrOptions.id : idOrOptions}` : ''}`)
      .json()
      .then((res: any) => {
        if (!res && typeof idOrOptions === 'object' && idOrOptions.reject) {
          throw new NotFoundError({
            entityName,
            search: [
              {
                field: 'id',
                value: idOrOptions.id,
              },
            ],
          });
        }
        return res;
      });
}
