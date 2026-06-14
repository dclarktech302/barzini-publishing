export const PIN_REGEX = /^\d{6,8}$/

export function validatePin(pin: string): boolean {
  return PIN_REGEX.test(pin)
}
