# Beccaccino

[![Build Status](https://travis-ci.org/extendi/beccaccino.svg?branch=master)](https://travis-ci.org/extendi/beccaccino)
[![Coverage Status](https://coveralls.io/repos/github/extendi/beccaccino/badge.svg?branch=master)](https://coveralls.io/github/extendi/beccaccino?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![GitHub issues](https://img.shields.io/github/issues/extendi/beccaccino.svg)](https://GitHub.com/extendi/beccaccino/issues/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/extendi/beccaccino/graphs/commit-activity)

<p align="center">
  <img width="468px" src="https://s3.eu-west-2.amazonaws.com/npm-extendi/beccaccino_logo.svg" />
</p>

``Beccaccino`` is an easy, reliable, framework agnostic http client for redux that is ~~blazing~~ beccaccino fast!

``Beccaccino`` is meant to be used both with Node.js and web applications (React, Vue, ...) 

# Getting Started

```bash   
yarn add beccaccino
```

Import the factory for building the client:
```js
> const {
    Beccaccino,
    beccaccinoMiddleware, 
    beccaccinoReducer, 
    BECCACCINO_REDUCER_NAME, 
    resultSelector 
  } = require('beccaccino');
```

Configure the client with endpoints:
```js
> const endpoints = [{ name: 'getBeers', path: '/v2/beers/:id', method: 'get' }/*, other endpoints ...*/]
> const client = Beccaccino.configure({ baseURL: 'https://api.punkapi.com' }, endpoints);
```
 
Go get some beer:
```js
// dispatch redux action
> const { createStore, applyMiddleware, combineReducers } = require('redux');
> const store = createStore(
    combineReducers({
      [BECCACCINO_REDUCER_NAME]: beccaccinoReducer,
    }),
    {},
    applyMiddleware(beccaccinoMiddleware),
  );
> store.dispatch(client.getBeers({ urlParams: { id: 1 } }))
> resultSelector({ state: store.getState(), endpointName: 'getBeers', limit: -1})
[ [ { id: 1,
      name: 'Buzz',
      tagline: 'A Real Bitter Experience.',
      first_brewed: '09/2007',
      description:
       'A light, crisp and bitter IPA brewed with English and American hops. A small batch brewed only once.',
      image_url: 'https://images.punkapi.com/v2/keg.png',
      abv: 4.5,
      ibu: 60,
      target_fg: 1010,
      target_og: 1044,
      ebc: 20,
      srm: 10,
      ph: 4.4,
      attenuation_level: 75,
      volume: [Object],
      boil_volume: [Object],
      method: [Object],
      ingredients: [Object],
      food_pairing: [Array],
      brewers_tips:
       'The earthy and floral aromas from the hops can be overpowering. Drop a little Cascade in at the end of the boil to lift the profile with a bit of citrus.',
      contributed_by: 'Sam Mason <samjbmason>' } ] ]

// just get some beer!
> client.getBeers({ urlParams: { id: 1 } }).execAsync.then(beer => console.log('Here\'s your beer! ', beer)
```
