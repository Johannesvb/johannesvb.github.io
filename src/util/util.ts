export function convertToArray(obj: any | any[] | undefined): any[] {
  if(obj === undefined) return []
  if(obj instanceof Array) {
    return obj
  } else {
    return [obj]
  }
}

// Functions for mapping values
export function map(current: number, in_min: number, in_max: number, out_min: number, out_max: number) {
  const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  return clamp(mapped, out_min, out_max);
}

export function clamp(input: number, min: number, max: number) {
  return input < min ? min : input > max ? max : input;
}