export const hello = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello from Lambda + TS!',
      timestamp: new Date().toISOString(),
    }),
  };
};
