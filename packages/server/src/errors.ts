/** RFC 9457 problem details, as returned by services (FE §19, api.problem-details). */
export interface Problem {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
}

/** A failed service call. `status` 0 means no response (network error or timeout). Never carries response bodies other than the problem. */
export class ServiceError extends Error {
  constructor(
    readonly service: string,
    readonly status: number,
    readonly requestId: string,
    readonly problem?: Problem,
    readonly code: 'http' | 'timeout' | 'network' | 'invalid-response' = 'http',
  ) {
    super(`${service}: ${code === 'http' ? `HTTP ${status}${problem?.title ? ` ${problem.title}` : ''}` : code} (request ${requestId})`);
    this.name = 'ServiceError';
  }
}

/** The circuit for a service is open: calls fail fast without reaching the service. */
export class CircuitOpenError extends Error {
  constructor(readonly service: string) {
    super(`${service}: circuit open`);
    this.name = 'CircuitOpenError';
  }
}

export async function parseProblem(res: Response): Promise<Problem | undefined> {
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('json')) return undefined;
  try {
    const body = (await res.json()) as Problem;
    return { type: body.type, title: body.title, status: body.status, detail: body.detail };
  } catch {
    return undefined;
  }
}
