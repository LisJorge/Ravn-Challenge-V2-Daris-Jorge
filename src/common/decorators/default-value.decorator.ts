import { Transform } from 'class-transformer';
import { TransformOptions } from 'class-transformer/types/interfaces';

export function DefaultValue(
  defaultValue: any,
  options?: TransformOptions,
): PropertyDecorator {
  return Transform(({ value }) => {
    if (value === undefined) return defaultValue;
    return value;
  }, options);
}
