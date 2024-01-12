declare module '@nmxjs/config' {
  interface IConfig {
    etcd?: {
      hosts: string[];
    };
  }
  const configKey: string;
}
