export class GenericQueryFilterDto<T> {
  filter?: T;

  pagination?: {
    limit?: number;
    offset?: number;
  };
}
