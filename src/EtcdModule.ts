import { Etcd3 } from 'etcd3';
import { Global, Module } from '@nestjs/common';
import { configKey, IConfig } from '@nmxjs/config';
import { etcdClientKey, repositoryFactoryServiceKey } from './constants';
import { IEtcdClient, IRepositoryFactoryService } from './interfaces';
import * as Services from './services';

@Global()
@Module({
  providers: [
    ...Object.values(Services),
    {
      provide: etcdClientKey,
      useFactory: async (config: IConfig): Promise<IEtcdClient | null> => {
        if (<unknown>config.etcd === false) {
          return null;
        }
        const etcdClient = new Etcd3(config.etcd);
        await etcdClient.get('/').catch(error => {
          if (error.message === '14 UNAVAILABLE: No connection established') {
            throw new Error(`Etcd not available!`);
          }
          throw new Error(`Etcd error: ${error.message}`);
        });
        return etcdClient;
      },
      inject: [configKey],
    },
    {
      provide: repositoryFactoryServiceKey,
      useFactory: (
        getEntitiesService: Services.GetEntitiesService,
        getEntityService: Services.GetEntityService,
        createEntitiesService: Services.CreateEntitiesService,
        updateEntityService: Services.UpdateEntityService,
        deleteEntityService: Services.DeleteEntityService,
        createSingleEntityService: Services.CreateSingleEntityService,
        watchChangesService: Services.WatchChangesService,
      ): IRepositoryFactoryService => ({
        create: ({ path, name }) => ({
          get: () => getEntitiesService.call(path),
          getOne: id => getEntityService.call(name, path, id),
          create: options => createEntitiesService.call(path, options),
          update: options => updateEntityService.call(path, options),
          delete: id => deleteEntityService.call(path, id),
          watch: () => watchChangesService.call(path),
        }),
        createSingle: ({ path, name }) => ({
          get: () => getEntityService.call(name, path),
          set: options => createSingleEntityService.call(path, options),
          delete: () => deleteEntityService.call(path),
        }),
        createChild: ({ parentPath, childPath, name }) => {
          const buildPath = (parentId: string) => `${parentPath}/${parentId}/${childPath}`;
          return {
            get: parentId => getEntitiesService.call(buildPath(parentId)),
            getOne: (parentId, id) => getEntityService.call(name, buildPath(parentId), id),
            create: (parentId, options) => createEntitiesService.call(buildPath(parentId), options),
            update: (parentId, options) => updateEntityService.call(buildPath(parentId), options),
            delete: (parentId, id) => deleteEntityService.call(buildPath(parentId), id),
            watch: () => watchChangesService.call(parentPath),
          };
        },
        createSingleChild: ({ parentPath, childPath, name }) => {
          const buildPath = (parentId: string) => `${parentPath}/${parentId}/${childPath}`;
          return {
            get: parentId => getEntityService.call(name, buildPath(parentId)),
            set: (parentId, options) => createSingleEntityService.call(buildPath(parentId), options),
            delete: parentId => deleteEntityService.call(buildPath(parentId)),
          };
        },
      }),
      inject: [
        Services.GetEntitiesService,
        Services.GetEntityService,
        Services.CreateEntitiesService,
        Services.UpdateEntityService,
        Services.DeleteEntityService,
        Services.CreateSingleEntityService,
        Services.WatchChangesService,
      ],
    },
  ],
  exports: [etcdClientKey, repositoryFactoryServiceKey],
})
export class EtcdModule {}
