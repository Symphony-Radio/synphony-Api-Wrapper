export class SymphonyRadioError extends Error {
  override name = "SymphonyRadioError";
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
  }
}

export class InvalidBaseUrlError extends SymphonyRadioError {
  override name = "InvalidBaseUrlError";
}

export class TimeoutError extends SymphonyRadioError {
  override name = "TimeoutError";
  constructor(message = "Request timed out", cause?: unknown) {
    super(message, cause);
  }
}

export class HttpError extends SymphonyRadioError {
  override name = "HttpError";
  constructor(
    message: string,
    public readonly status: number,
    public readonly url: string,
    public readonly bodyText?: string
  ) {
    super(message);
  }
}

export class ParseError extends SymphonyRadioError {
  override name = "ParseError";
}
