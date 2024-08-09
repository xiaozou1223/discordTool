export class ApiResponse<T> {
  statusCode!: number;
  success!: boolean;
  message!: string;
  data?: T | T[] | null;
  pagination?: Pagination;
  public set(response: Partial<ApiResponse<T>>) {
    if (response.statusCode !== undefined) this.statusCode = response.statusCode;
    if (response.success !== undefined) this.success = response.success;
    if (response.message !== undefined) this.message = response.message;
    if (response.data !== undefined) this.data = response.data;
    if (response.pagination !== undefined) this.pagination = response.pagination;
  }
}

export class Pagination {
  currentPage: number
  pageSize: number
  total: number
  hasPrevious: boolean
  hasNext: boolean

  constructor(currentPage: number, pageSize: number, total: number, hasPrevious: boolean, hasNext: boolean) {
    this.currentPage = currentPage
    this.pageSize = pageSize
    this.total = total
    this.hasPrevious = hasPrevious
    this.hasNext = hasNext
  }
}
