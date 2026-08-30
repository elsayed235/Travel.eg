import { ProblemDetails, buildProblemDetails } from '../../src/shared';

export type { ProblemDetails };

export function createProblemDetails(params: {
  typeSuffix: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  correlationId?: string;
  invalidParams?: Array<{ name: string; reason: string }>;
  extra?: Record<string, any>;
}): ProblemDetails {
  return buildProblemDetails(params);
}

