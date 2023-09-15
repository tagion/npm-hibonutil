# HiBON-wrapper for NPM

This project is planned as NPM module wrapper for HiBON using `hibonutil`

> **Disclaimer**  
> This software is in development. Errors and instabilities are expected.
>
> The util works only with linux, tested on Ubuntu 23.04.  
>
> Cross-platform not supported for now, since module uses linux-only binary

## Gettings Started

To use this module `hibonutil` need to be installed.
You can check this with commmand
```
hibonutil --version
```

To get started you can run following command from root directory
```
npm run build
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