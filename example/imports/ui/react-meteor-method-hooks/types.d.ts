export type UseMeteorCallHook = (
  name: string,
  config?: {
    /** Callback to be executed after the method is called */
    cb?: (error: object | undefined, result: any) => void;

    /** Validate params before handler execution */
    validate?: (...params: any[]) => boolean;
    /** Transform params after validation before handler execution */
    transform?: (...params: any[]) => any[];

    /** Forces to use Meteor.call() instead of Meteor.callAsync() */
    forceSyncCall?: boolean;
    /** Adds some logging in console */
    logging?: boolean;
    /**
     * By default the package logs console.error for all incoming errors
     * The setting disables such logs
     */
    suppressErrorLogging?: boolean;
  },
  ...params: any[]
) => [
  methodHandler: (...params: any[]) => Promise<any>,
  loading: boolean,
  error: object | undefined,
  result: any
];

export type UseMeteorCallHookState = {
  loading: boolean;
  error?: object;
  result: any;
};
