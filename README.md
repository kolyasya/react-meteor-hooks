# react-meteor-method-hooks

Updated to work with `Meteor.callAsync()` method.

Simple hook to handle `Meteor.callAsync()` or `Meteor.call()` requests.

Usage example:

```javascript
import React from 'react';
import { useMeteorCall } from 'react-meteor-method-hooks';

const MyComponent = () => {

  const [
    calculateSomething,
    calculateSomethingLoading,
    calculateSomethingError,
    calculateSomethingResult
  ] = useMeteorCall(
    'calculateSomethingMethodName',
    {
      /** Callback to be executed after the method is called */
      cb: (error, result) => {
        if (error) {
          alert(error.reason);
        } else {
          console.log(result);
        }
      },

      /** Validate params before handler execution */
      validate: (...params) => {
        const param = params[0];

        return param.methodParam === 'Test string';
      },
      /** Transform params after validation before handler execution */
      transform: (...params) => {
        const param = params[0];

        return [{ ...param, methodParam: 'Transformed string' }];
      },

      /** Forces to use Meteor.call() instead of Meteor.callAsync() */
      forceSyncCall: true,
      /** Adds some logging in console */
      logging: true,
      /**
       * By default the package logs console.error for all incoming errors
       * The setting disables such logs
       */
      suppressErrorLogging: true
    },
    { methodParam: 'Test string' },
  );

  return (
    <button
      onClick={calculateSomething}
      disabled={calculateSomethingLoading}
    >
      Calculate
    </button>

    <div className="error">{calculateSomethingError}</div>
    <div className="result">{calculateSomethingResult}</div>
  )
}
```
