![Node.js CI](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/workflows/Node.js%20CI/badge.svg)
![npm](https://img.shields.io/npm/v/contentstack-cli-content-type)

## Description
This is a plugin for [Contentstack's](https://www.contentstack.com/) CLI.
It allows you to quickly retrieve information about Content Types in a Stack.

## How to install this plugin

```shell
$ csdx plugins:install contentstack-cli-content-type
```

## How to use this plugin
This plugin requires you to be authenticated using [csdx auth:login](https://www.contentstack.com/docs/developers/cli/authenticate-with-the-cli/).

Several commands, such as `csdx content-type:compare` support token aliases as input.
These token aliases should be created using `csdx auth:tokens:add`.

The commands only use the **Stack API Key**. The management token is ignored.
They are provided as a convenience, so the Stack API Keys do not have to be re-typed. 

## Usability
The `csdx content-type:details` command requires a wide terminal window. If the `path` column is not needed, you can hide it:

```shell
$ csdx content-type:details -a "management token" -c "content type" --no-path
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`csdx content-type:audit`](#csdx-content-typeaudit)
* [`csdx content-type:compare`](#csdx-content-typecompare)
* [`csdx content-type:compare-remote`](#csdx-content-typecompare-remote)
* [`csdx content-type:details`](#csdx-content-typedetails)
* [`csdx content-type:list`](#csdx-content-typelist)

## `csdx content-type:audit`

display recent changes to a Content Type

```
USAGE
  $ csdx content-type:audit

OPTIONS
  -a, --token-alias=token-alias    management token alias
  -c, --content-type=content-type  (required) Content Type UID
  -s, --stack=stack                Stack UID

EXAMPLES
  $ csdx content-type:audit -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"
  $ csdx content-type:audit -a "management token" -c "home_page"
```

_See code: [src/commands/content-type/audit.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.1/src/commands/content-type/audit.ts)_

## `csdx content-type:compare`

compare two Content Type versions

```
USAGE
  $ csdx content-type:compare

OPTIONS
  -a, --token-alias=token-alias    management token alias
  -c, --content-type=content-type  (required) Content Type UID
  -l, --left=left                  Content Type version, i.e. prev version
  -r, --right=right                Content Type version, i.e. later version
  -s, --stack=stack                Stack UID

EXAMPLES
  $ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"
  $ csdx content-type:compare -s "xxxxxxxxxxxxxxxxxxx" -c "home_page" -l # -r #
  $ csdx content-type:compare -a "management token" -c "home_page" -l # -r #
```

_See code: [src/commands/content-type/compare.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.1/src/commands/content-type/compare.ts)_

## `csdx content-type:compare-remote`

compare two Content Types on different Stacks

```
USAGE
  $ csdx content-type:compare-remote

OPTIONS
  -c, --content-type=content-type  (required) Content Type UID
  -o, --origin-stack=origin-stack  (required) origin Stack UID
  -r, --remote-stack=remote-stack  (required) remote Stack UID

EXAMPLE
  $ csdx content-type:compare-remote -o "xxxxxxxxxxxxxxxxxxx" -r "xxxxxxxxxxxxxxxxxxx" -c "home_page"
```

_See code: [src/commands/content-type/compare-remote.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.1/src/commands/content-type/compare-remote.ts)_

## `csdx content-type:details`

display Content Type details

```
USAGE
  $ csdx content-type:details

OPTIONS
  -a, --token-alias=token-alias    management token alias
  -c, --content-type=content-type  (required) Content Type UID
  -p, --[no-]path                  show path column
  -s, --stack=stack                Stack UID

EXAMPLES
  $ csdx content-type:details -s "xxxxxxxxxxxxxxxxxxx" -c "home_page"
  $ csdx content-type:details -a "management token" -c "home_page"
  $ csdx content-type:details -a "management token" -c "home_page" --no-path
```

_See code: [src/commands/content-type/details.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.1/src/commands/content-type/details.ts)_

## `csdx content-type:list`

list all Content Types in a Stack

```
USAGE
  $ csdx content-type:list

OPTIONS
  -a, --token-alias=token-alias  management token alias
  -o, --order=title|modified     [default: title] order by column
  -s, --stack=stack              Stack UID

EXAMPLES
  $ csdx content-type:list -s "xxxxxxxxxxxxxxxxxxx"
  $ csdx content-type:list -a "management token"
  $ csdx content-type:list -a "management token" -o modified
```

_See code: [src/commands/content-type/list.ts](https://github.com/Contentstack-Solutions/contentstack-cli-content-type/blob/v1.0.1/src/commands/content-type/list.ts)_
<!-- commandsstop -->
