# HiBON-wrapper for NPM

This project is planned as NPM module wrapper for HiBON using `hibonutil`

> **Disclaimer**  
> This software is in development. Errors and instabilities are expected.
>
> The util works only with linux, tested on Ubuntu 23.04.  
>
> Cross-platform not supported for now, since module uses linux-only binary

## Install

Firstly you need to clone this repository.
> Make sure that you have needed access rights and SSH key.
```
git clone git@github.com:tagion/npm-hibonutil.git
cd npm-hibonutil
```
Install needed depencencies and run build:
```
npm install
npm run build
```
If install and build passed without errors - everything is ready for use

## Gettings Started

To use this module `hibonutil` need to be installed.
You can check this with commmand
```
hibonutil --version
```
---
To get started and prove you have everything installed you can run following command from root directory
```
npm run build
```
---
To start server with API for given SDK you can run following command from root directory
```
npm run start
```
In order to start the server on the specified port you can run
```
npm run start -- -p 3333
``` 
---
To run short test for server and SDK you can run following command from root directory
```
npm run test
```


## Scructure

- `src/` source files for this module
  - `src/hibon/` structure that contains HiBON object
  - `src/tagion/` wrappers for tagion binaries
- `srcipt/` utilitary scripts for testing purposes

## Maintainers

- [@Ivan Bilan](https://github.com/iwantegren)

## Support

If you have any problems with this module, please, [open an issue](https://github.com/tagion/npm-hibonutil/issues/new).