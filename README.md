# HiBON Util for NPM

HiBON Util is a CLI for JSON-to-HiBON and HiBON-to-JSON converting.

> **Disclaimer**  
> This software is in alpha stage. Errors and instabilities are expected.
>
> The util works only with linux, tested on Ubuntu 20.04.  
>
> Cross-platform support is on the roadmap, but we can not announce any dates at this time.

## Gettings Started

```
npm i -g hibonutil
hibonutil --help
```

## Usage
```
./hibonutil [<option>...] <in-file> <out-file>
./hibonutil [<option>...] <in-file>

<option>:
      --version Display the version
-i  --inputfile Sets the input file name
-o --outputfile Sets the output file name
-b        --bin Use HiBON or else use JSON
-V      --value Bill value : default: 1000000000
-p     --pretty JSON Pretty print: Default: false
-h       --help This help information.
```

## Maintainers

- [@vladpazych](https://github.com/vladpazych)

## Support



If you have any problems with this util, please, [open an issue](https://github.com/tagion/alpha_three/issues/new).