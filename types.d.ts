declare module '@nestjs/common' {
  class Logger {
    static warn(data);
  }

  type DynamicModule = any;

  const Global = (): ClassDecorator => {};
  const Module = (data): ClassDecorator => {};
  const Inject: (data) => ParameterDecorator;
  const Injectable = (): ClassDecorator => {};
}

declare module '@nmxjs/config' {
  interface IConfig {
    etcd?: {
      hosts: string[];
    };
  }
  const configKey: string;
}
