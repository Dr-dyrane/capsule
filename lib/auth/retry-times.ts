export function getRetryAtOffset(minutesFromNow: number) {
  return new Date(Date.now() + minutesFromNow * 60 * 1000).toISOString()
}
