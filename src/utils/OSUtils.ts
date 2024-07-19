export function isMacOS(): boolean {
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
}
