contentstack-cli-content-type
===

## Description
This is a plugin for [Contentstack's](https://www.contentstack.com/) CLI.
It allows you to quickly retrieve information about Content Types in a Stack.

## How to install this plugin

```shell
$ csdx plugins:install contentstack-cli-content-type
```

## How to use this plugin

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g contentstack-cli-content-type
$ csdx COMMAND
running command...
$ csdx (-v|--version|version)
contentstack-cli-content-type/1.0.0 darwin-x64 node-v12.16.1
$ csdx --help [COMMAND]
USAGE
  $ csdx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`csdx content-type:audit`](#csdx-content-typeaudit)
* [`csdx content-type:compare`](#csdx-content-typecompare)
* [`csdx content-type:details`](#csdx-content-typedetails)
* [`csdx content-type:list`](#csdx-content-typelist)

## `csdx content-type:audit`

display Audit Logs for recent changes to a Content Type

```
USAGE
  $ csdx content-type:audit

OPTIONS
  -a, --token-alias=token-alias    management token alias
  -c, --content-type=content-type  (required) Content Type UID
  -s, --stack=stack                stack uid

EXAMPLES
  $ csdx content-type:audit -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"
  $ csdx content-type:audit -a "management token" -c "home_page"
```

_See code: [src/commands/content-type/audit.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.0/src/commands/content-type/audit.ts)_

## `csdx content-type:compare`

compare two Content Type versions

```
USAGE
  $ csdx content-type:compare

OPTIONS
  -a, --token-alias=token-alias    management token alias
  -c, --content-type=content-type  (required) Content Type UID
  -l, --left=left                  (required) Content Type version
  -r, --right=right                (required) Content Type version
  -s, --stack=stack                stack uid

EXAMPLES
  $ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"
  $ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page" -l # -r #
  $ csdx content-type:compare -a "management token" -c "home_page" -l # -r #
```

_See code: [src/commands/content-type/compare.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.0/src/commands/content-type/compare.ts)_

## `csdx content-type:details`

display Content Type details

```
USAGE
  $ csdx content-type:details

OPTIONS
  -a, --token-alias=token-alias    management token alias
  -c, --content-type=content-type  (required) Content Type UID
  -p, --[no-]path                  show path column
  -s, --stack=stack                stack uid

EXAMPLES
  $ csdx content-type:details -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"
  $ csdx content-type:details -a "management token" -c "home_page"
  $ csdx content-type:details -a "management token" -c "home_page" --no-path
```

_See code: [src/commands/content-type/details.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.0/src/commands/content-type/details.ts)_

## `csdx content-type:list`

list all Content Types in a Stack

```
USAGE
  $ csdx content-type:list

OPTIONS
  -a, --token-alias=token-alias  management token alias
  -o, --order=title|modified     [default: title] order by column
  -s, --stack=stack              stack uid

EXAMPLES
  $ csdx content-type:list -s "xxxxxxxxxxxxxxxxxxx"
  $ csdx content-type:list -a "management token"
  $ csdx content-type:list -a "management token" -o modified
```

_See code: [src/commands/content-type/list.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.0/src/commands/content-type/list.ts)_
<!-- commandsstop -->
