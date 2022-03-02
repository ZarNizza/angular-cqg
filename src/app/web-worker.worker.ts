function fibonacci(num: number): number {
  if (num == 1 || num == 2) {
    return 1;
  }
  return fibonacci(num - 1) + fibonacci(num - 2);
}
self.addEventListener('message', (evt: MessageEvent) => {
  const num = evt.data;
  postMessage(fibonacci(num));
});
