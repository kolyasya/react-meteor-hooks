import { Meteor } from 'meteor/meteor';
import { useState, useCallback } from 'react';

/** @type {import('./types').UseMeteorCallHookState} */
const initialState = {
  loading: false,
  error: undefined,
  result: undefined,
};

/** @type {import('./types').UseMeteorCallHook} */
const useMeteorCall = (
  name,
  {
    cb,
    validate = (params) => params,
    forceSyncCall = false,
    logging = false,
    suppressErrorLogging = false,
  } = {},
  ...params
) => {
  if (!Meteor) {
    return console.error(
      `This package only works in Meteor environment. Check https://www.meteor.com/`
    );
  }

  if (!name) {
    console.error('Name is required to call Meteor method');
  }

  const [loading, setLoading] = useState(initialState.loading);
  const [error, setError] = useState(initialState.error);
  const [result, setResult] = useState(initialState.result);

  const methodHandler = useCallback(
    async (...customParams) => {
      setLoading(true);
      setError(initialState.error);
      setResult(initialState.result);

      let paramsToUse;
      try {
        // User can override method parameters at execution time
        if (customParams.length && logging) {
          console.log(
            `Custom params provided for the call, using them instead of hook params`,
            { customParams }
          );
        }

        paramsToUse = validate(
          ...(customParams.length ? customParams : params)
        );
      } catch (error) {
        if (logging) {
          console.log(`Error while validating params:`, error);
        }

        setLoading(false);
        setError(error);

        return;
      }

      // Meteor 3.0
      if (typeof Meteor.callAsync === 'function' && !forceSyncCall) {
        try {
          if (logging) {
            console.log(
              `Method ${name} call with a new API (Meteor.callAsync), params:`
            );
            console.log(JSON.stringify(paramsToUse, undefined, 2));
          }

          const result = await Meteor.callAsync(name, ...paramsToUse);
          setLoading(false);
          setResult(result);

          if (logging) {
            console.log(`Method ${name} result received:`);
            console.log(JSON.stringify(result, undefined, 2));
          }

          if (typeof cb === 'function') {
            logging && console.log(`Method ${name} running a callback...`);
            cb(error, result);
          }
        } catch (error) {
          if (logging) {
            console.log(`Method ${name} error:`);
            console.log(JSON.stringify(error, undefined, 2));
          }

          if (!suppressErrorLogging) {
            console.error(error);
          }

          setError(error);
        }
      }
      // Meteor 2.x
      else {
        if (logging) {
          console.log(
            `Method ${name} call with an old API (Meteor.call), params:`
          );
          console.log(JSON.stringify(paramsToUse, undefined, 2));
        }
        Meteor.call(name, ...paramsToUse, (error, result) => {
          setLoading(false);
          setError(error);
          setResult(result);

          if (error && !suppressErrorLogging) {
            console.error(error);
          }

          if (logging) {
            if (!error) {
              console.log(`Method ${name} result received:`);
              console.log(JSON.stringify(result, undefined, 2));
            } else {
              console.log(`Method ${name} error:`);
              console.log(JSON.stringify(error, undefined, 2));
            }
          }

          if (typeof cb === 'function') {
            logging && console.log(`Method ${name} running a callback...`);
            cb(error, result);
          }
        });
      }
    },
    [name, params, cb, validate, forceSyncCall, logging, suppressErrorLogging]
  );

  return [methodHandler, loading, error, result];
};

export { useMeteorCall };
