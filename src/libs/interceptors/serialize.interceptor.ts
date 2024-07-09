import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass, ClassConstructor } from 'class-transformer';

export class SerializerInterCeptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<T> {
    // console.log(`I am running before handler `, context);
    return next.handle().pipe(
      map((data: T) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}

export function Serializer<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializerInterCeptor<T>(dto));
}
