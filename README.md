# OPM
> OpenAPI Project Manager

## Install

```sh
$ brew tap wess/packages
$ brew update
$ brew install opm
```

## Usage:

- help : Shows available commands.
- init : Create a new project file.
- build : Build the openapi.yaml file.
- clean : Clean the openapi.yaml file.

```sh
$ mkdir myspec
$ cd myspec
$ opm init
$ opm build
$ cat openapi.yaml
```

## License
See LICENSE
