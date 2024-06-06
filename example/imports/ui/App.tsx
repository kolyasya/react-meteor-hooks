import React, { useEffect } from 'react';

import { useMeteorCall } from './react-meteor-method-hooks/useMeteorCall';

export const App = () => {
  const [
    methodWithResult,
    methodWithResultLoading,
    methodWithResultError,
    methodWithResultResult,
  ] = useMeteorCall(
    'methodWithResult',
    {
      cb: (error, result) => {
        console.log('methodWithResult callback', { error, result });
      },
      validate: (...params) =>
        params.every((param) => typeof param === 'string'),
      transform: (...params) => params.map((p, i) => `${i + 1}-${p}`),
      forceSyncCall: false,
      logging: false,
      suppressErrorLogging: false,
    },
    'one',
    'two',
    'three'
  );

  const [
    methodWithError,
    methodWithErrorLoading,
    methodWithErrorError,
    methodWithErrorResult,
  ] = useMeteorCall('methodWithError', {
    cb: (error, result) => {
      console.log('methodWithError callback', { error, result });
    },
    forceSyncCall: false,
    logging: false,
    suppressErrorLogging: false,
  });

  useEffect(() => {
    methodWithResult();
    methodWithError();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // methodWithResult('one', 'two', 'three');
      // methodWithResult();
      // methodWithResult({});
      methodWithResult({ customParam: true });
    }, 15000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    console.log({
      methodWithResultLoading,
      methodWithResultError,
      methodWithResultResult,
      methodWithErrorLoading,
      methodWithErrorError,
      methodWithErrorResult,
    });
  }, [
    methodWithResultLoading,
    methodWithResultError,
    methodWithResultResult,
    methodWithErrorLoading,
    methodWithErrorError,
    methodWithErrorResult,
  ]);

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h4>methodWithResult</h4>
        <pre>
          {JSON.stringify(
            {
              methodWithResultLoading,
              methodWithResultError,
              methodWithResultResult,
            },
            undefined,
            2
          )}
        </pre>
      </div>
      <div>
        <h4>methodWithError</h4>
        <pre>
          {JSON.stringify(
            {
              methodWithErrorLoading,
              methodWithErrorError,
              methodWithErrorResult,
            },
            undefined,
            2
          )}
        </pre>
      </div>
    </div>
  );
};
