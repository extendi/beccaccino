# Change Log

* v0.1.4
  - Add requestsLog section in the store state
    * requestsLog is an array of requests ids
    * we add a request ids to the list when we receive a
      REDUX_HTTP_CLIENT_REQUEST action
    * We need this lists to have the selectors that work on a slice
      of the state before the requests results are written function
      properly (i.e. loadingSelector)
    * since we have a list of the requests ids we changed the results
      slice of the state to be a map over ids (as the requestsMetadata)
      As a side effect of this the takeNext reducer and the
      beccaccinoSelector have a more straightforward implementation.
  - Rename requests object in state to results
    * The object was not storing the requests but the results
      received, we were setting the requests only in the response
      branches of the reducer.

      (cf. src/redux-http/reducer.ts)

* v0.1.3

* v0.1.2

* v0.1.0
 - beccaccino HTTP client factory
 - dynamic actions and reducer definition
 - state selectors
