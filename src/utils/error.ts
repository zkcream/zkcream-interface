class ApplicationError implements Error {
  public name = 'ApplicationError'
  constructor(public message: string) {}
}

export class FormatError extends ApplicationError {
  public name = 'FormatError'
}

export class TxError extends ApplicationError {
  public name = 'TxError'
}
