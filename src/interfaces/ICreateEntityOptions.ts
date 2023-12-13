export interface ICreateEntityOptions<T = any> {
  payload: Omit<T, 'id'> & { id?: string };
}
