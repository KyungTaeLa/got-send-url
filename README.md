# got-send-url

`got-send-url` is an HTTP communication library based on the GOT module for Node.js.

## Installation

```sh
npm install got-send-url
```

## Usage

```ts
import sendURL from "got-send-url";

const result = await sendURL({
  url: `https://www.npmjs.com/package/got-send-url`,
  method: "GET",
  body: {
    text: "hello world",
  },
  headers: {
    cookie: "cookie",
  },
  retryLimit: 5,
  retryDelay: 3000,
  responseType: "json",
  useProxyYn: false,
  useThrowYn: true,
});
```

## Tips

- url, method, and body fields are required.
- By default, it retries on communication failure. To disable this option, set retryLimit to 0.
- The retry delay time increases exponentially (starting from 1 second) on each retry. If you want a fixed delay time, use the retryDelay option.

## Features

- Based on the GOT module used in over 10,000 packages and more than 5 million repositories
- Handles request values to make it easy to use the core functionalities of the GOT module