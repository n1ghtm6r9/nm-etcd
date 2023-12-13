export interface IUpdateEntityOptions<T = any> {
  id: string;
  payload: Partial<Omit<T, 'id'>>;
}
