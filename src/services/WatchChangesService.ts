import { Watcher } from 'etcd3';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { sleep, bufferDebounce } from '@nmxjs/utils';
import { IEtcdClient } from '../interfaces';
import { etcdClientKey } from '../constants';

@Injectable()
export class WatchChangesService {
  constructor(@Inject(etcdClientKey) protected readonly etcd: IEtcdClient) {}

  public call = (path: string): Observable<any> =>
    new Observable(subscriber => {
      let watcher: Watcher;
      const reconnect = async (): Promise<boolean> => {
        watcher?.removeAllListeners('put');
        watcher?.removeAllListeners('connected');
        watcher?.removeAllListeners('disconnected');
        watcher = await this.etcd.watch().prefix(path).watcher();
        watcher.on('disconnected', async () => {
          while (true) {
            Logger.warn('Store Schema try reconnect to etcd.');
            const result = await reconnect();

            if (result) {
              Logger.warn('Store Schema success reconnect.');
              break;
            }

            Logger.warn('Store Schema wait 10s to reconnect.');

            await sleep({ time: 10000 });
          }
        });

        watcher.on('put', data => {
          subscriber.next(JSON.parse(data.value.toString()));
        });

        return new Promise(resolve => {
          watcher.on('connected', () => {
            watcher.removeAllListeners('connected');
            resolve(true);
          });
          watcher.on('error', () => {
            resolve(false);
          });
        });
      };
      reconnect();
    }).pipe(bufferDebounce(500));
}
