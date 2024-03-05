# Overpass QL TS

This package aims to make creating dynamic overpassql queries easier by providing a query builder.  
You wont need to worry about making small mistakes with syntax, and neither about changing existing queries.

[![npm version](https://badgen.net/npm/v/overpass-ql-ts)](https://npmjs.org/package/overpass-ql-ts)
[![install size](https://packagephobia.com/badge?p=overpass-ql-ts@1.4.1)](https://packagephobia.com/result?p=overpass-ql-ts@1.4.1)
[![tests](https://github.com/JuanCouste/overpass-ql-ts/actions/workflows/testing.yml/badge.svg)](https://github.com/JuanCouste/overpass-ql-ts/actions/workflows/testing.yml)
[![Coverage Status](https://coveralls.io/repos/github/JuanCouste/overpass-ql-ts/badge.svg?branch=master)](https://coveralls.io/github/JuanCouste/overpass-ql-ts?branch=master)

```typescript
import { DefaultOverpassApi, OverpassOutputVerbosity } from "overpass-ql-ts";

const api = DefaultOverpassApi();

const result = await api.execJson((s) => [s.node.query({ name: /^Hospital/, amenity: "hospital" })], {
	verbosity: OverpassOutputVerbosity.Geometry,
});

const someHospital = result.elements[0];

console.log(someHospital.lat, someHospital.lon);
```

## Instalation

```shell
npm install overpass-ql-ts
```

## Features & "Roadmap"

The package is usable though many features we intend to implement are WIP.

### This package can:

1.  Build queries declaratively
2.  Execute those queries
3.  Execute string queries
4.  Validate the results of queries
5.  Query overpass api instances for status
6.  Point to any overpass instance
7.  Use broser fetch or XMLHttpRequest
8.  Use nodejs http or https
9.  Use any other http client that you adapt to this package

### Roadmap

1.  String sanitization
2.  Recurse filter, way_cnt, way_link
3.  Chaining of bbox, id, filter, etc in the same statement
4.  Evaluator support
5.  Flow control statements
6.  Around
7.  etc

## Examples

To run the examples you may need to include some options due to the package being a module.

```shell
node --experimental-specifier-resolution=node --loader ts-node/esm ./examples/simple.ts
```

## Development

We currently use rollup to bundle esm and commonjs versions of the code.

```shell
npm run build
```

The **build** script configures the path transform plugin and generates the .mjs, .cjs and .d.ts bundles.

```shell
npm run check
```

The **check** script runs tsc to check for errors.

## Contribution

If you find a bug and wish to fix it, remember to update the tests! Fork & Pull request.

If you want to add features, do let us know, some things may not align with what we want from the package.  
We would prefer to avoid production dependencies, though development dependencies are aceptable

If you would like to add just more tests to improve coverage and edge case handling, thank you!

## Testing

We currently use jest with ts-jest preset, test are run on pushes or pull requests to master.  
We've setup a docker image with static data, to facilitate testing.

### Local testing

If you want to run tests locally, you'll need a docker engine to run the static image.

```shell
npm run overpass-container
```

The **overpass-container** script will setup the test image and start it.

If the docker engine you are using its not in your local machine, you can run the tests with

```shell
npm run test-in-container
```

The **test-in-container** script will create an image from this package,  
and run it in a network with the test image that is launched from the **overpass-container** script.

### Environment

The following are env variables used in testing, they can be configured via [.env](https://www.npmjs.com/package/dotenv) file in the project root.

| Variable               | Optional | Description                      | Example                          |
| ---------------------- | -------- | -------------------------------- | -------------------------------- |
| OVERPASS_QL_TS_URL     | No       | Url to api/interpreter           | http://localhost/api/interpreter |
| OVERPASS_QL_BUNDLING   | Yes      | Wether to do bundling tests      | Yes / No / Y / N / true / false  |
| OVERPASS_QL_BROWSER    | Yes      | Path to browser executable       |                                  |
| OVERPASS_QL_TIMEOUT    | Yes      | Jest timeout                     | 2000                             |
| OVERPASS_QL_TS_NODE_I  | Yes      | Discard type checking on tests   | Yes / No / Y / N / true / false  |
| OVERPASS_QL_TEST_BUNCH | Yes      | Group all tests in a single file | Yes / No / Y / N / true / false  |
