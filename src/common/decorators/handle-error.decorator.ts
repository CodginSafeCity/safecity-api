// src/common/decorators/handle-error.decorator.ts

import { HttpException, Logger } from '@nestjs/common';

export type ErrorException = new (message: string) => HttpException;

export type HandleErrorOptions = {
  errorException?: ErrorException;
  throwError?: boolean;
};

export function HandleError(context?: string, options?: HandleErrorOptions) {
  return (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    return wrapMethod(descriptor, context ?? 'Unexpected error', options);
  };
}

function wrapMethod(
  descriptor: PropertyDescriptor,
  context: string,
  options?: HandleErrorOptions,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const className = this.constructor.name;
    const logger = new Logger(className);

    try {
      return await originalMethod.apply(this, args);
    } catch (error) {
      const errorMessage = `[${context}] ${error.message ?? error} - ${error.stack ?? ''}`;
      logger.error(errorMessage);

      if (options?.errorException && options?.throwError) {
        throw new options.errorException(errorMessage);
      }

      if (options?.errorException) {
        throw new options.errorException(context);
      }

      if (options?.throwError) {
        throw error;
      }

      // si no hay configuración, default: InternalServerError
      throw new HttpException(context, 500);
    }
  };

  return descriptor;
}
