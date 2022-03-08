describe('quotesServer', () => {
  jest.useFakeTimers();
  const quotesServer = require('./quotesServer.worker');

  it('should create the app', () => {
    expect(typeof quotesServer.getRandomQuotes).toBe('Array');
  });
});
