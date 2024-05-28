type Params = any[] | Record<string, any>;

export type UseMeteorCallHook = (
  name: string,
  params?: Params,
  cb?: (error: object | undefined, result: any) => void,
  hookParams?: {
    /** Validate and mutate params before handler execution */
    validate?: (params: Params) => Params;

    /** Forces to use Meteor.call() instead of Meteor.callAsync() */
    forceSyncCall?: boolean;
    /** Adds some logging in console */
    logging?: boolean;
    /**
     * By default the package logs console.error for all incoming errors
     * The setting disables such logs
     */
    suppressErrorLogging?: boolean;
  }
) => [
  methodHandler: (...params: any[]) => Promise<any>,
  loading: boolean,
  error: object | undefined,
  result: any
];

export type UseMeteorCallHookInitialState = {
  loading: boolean;
  error: object | undefined;
  result: any;
};
