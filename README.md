![npm](https://img.shields.io/npm/v/contentstack-cli-content-type)

## Description
This is a plugin for [Contentstack's](https://www.contentstack.com/) CLI.
It allows you to quickly retrieve information about Content Types in a Stack.

## Why use this plugin
1. The `csdx content-type:audit` command lists recent changes to a content type and by whom.
This is useful when needing to find Content Type versions to compare with `csdx content-type:compare`.
[Audit logs](https://www.contentstack.com/docs/developers/set-up-stack/monitor-stack-activities-in-audit-log/) are stored for 90 days within Contentstack. 

1. The `csdx content-type:compare-remote` command allows you to compare the same Content Type between two Stacks.
This is useful when you have cloned or duplicated a Stack, and want to check what has changed in a child Stack.

1. The `csdx content-type:compare` command allows you to compare multiple versions of a Content Type within a single Stack.
This is useful when you are working in a development team, and want to compare changes made by colleagues.

1. The `csdx content-type:list` command is useful when you want to see all the Content Types within a Stack.
The Content Type's Display Name, UID, Last Modified Date, and Version number is shown. The list can be ordered by `title` or `modified` date. When developing against Contentstack, Content Type UIDs are needed when requesting data.

1. The `csdx content-type:details` command provides useful information, such as:
    * Field UID and Data Types
    * Referenced Content Types
    * Options such as required, multiple, and unique
    * The full path to a field, useful when using the [include reference endpoint](https://www.contentstack.com/docs/developers/apis/content-delivery-api/#include-reference) or filtering operations, such as the [equality endpoint](https://www.contentstack.com/docs/developers/apis/content-delivery-api/#equals-operator).

1. The `csdx content-type:diagram` command creates a visual representation of a Stack's content model.
    * The ouput format can be either `svg` or `dot`. 
    * The diagram's orientation can be changed, using the `-d landscape|portrait` flag.
    * [GraphViz](https://graphviz.org/) is the layout engine. You can export the generated DOT Language source, using the `-t dot` flag.
    * ![Diagram Output](https://github.com/contentstack/contentstack-cli-content-type/blob/main/screenshots/starter-app.svg)

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
* [`csdx content-type:diagram`](#csdx-content-typediagram)
* [`csdx content-type:list`](#csdx-content-typelist)

## `csdx content-type:audit`

Display recent changes to a Content Type

```
USAGE
  $ csdx content-type:audit -c <value> [-s <value> | -a <value> | -a <value>] [-k <value> |  | ]

FLAGS
  -a, --alias=<value>          Alias of the management token
  -a, --token-alias=<value>    Management token alias
  -c, --content-type=<value>   (required) Content Type UID
  -k, --stack-api-key=<value>  Stack API Key
  -s, --stack=<value>          Stack UID

DESCRIPTION
  Display recent changes to a Content Type

EXAMPLES
  $ csdx content-type:audit --stack-api-key "xxxxxxxxxxxxxxxxxxx" --content-type "home_page"

  $ csdx content-type:audit --alias "management token" --content-type "home_page"
```

_See code: [src/commands/content-type/audit.ts](https://github.com/contentstack/contentstack-cli-content-type/blob/v1.4.0/src/commands/content-type/audit.ts)_

## `csdx content-type:compare`

Compare two Content Type versions

```
USAGE
  $ csdx content-type:compare -c <value> [-s <value> | -a <value>] [-k <value> | ] [-a <value>] [-l <value> -r <value>]

FLAGS
  -a, --alias=<value>          Alias of the management token
  -a, --token-alias=<value>    Management token alias
  -c, --content-type=<value>   (required) Content Type UID
  -k, --stack-api-key=<value>  Stack API Key
  -l, --left=<value>           Content Type version, i.e. prev version
  -r, --right=<value>          Content Type version, i.e. later version
  -s, --stack=<value>          Stack UID

DESCRIPTION
  Compare two Content Type versions

EXAMPLES
  $ csdx content-type:compare --stack-api-key "xxxxxxxxxxxxxxxxxxx" --content-type "home_page"

  $ csdx content-type:compare --stack-api-key "xxxxxxxxxxxxxxxxxxx" --content-type "home_page" --left # --right #

  $ csdx content-type:compare --alias "management token" --content-type "home_page" --left # --right #
```

_See code: [src/commands/content-type/compare.ts](https://github.com/contentstack/contentstack-cli-content-type/blob/v1.4.0/src/commands/content-type/compare.ts)_

## `csdx content-type:compare-remote`

compare two Content Types on different Stacks

```
USAGE
  $ csdx content-type:compare-remote (-o <value> -r <value>) -c <value>

FLAGS
  -c, --content-type=<value>  (required) Content Type UID
  -o, --origin-stack=<value>  (required) Origin Stack API Key
  -r, --remote-stack=<value>  (required) Remote Stack API Key

DESCRIPTION
  compare two Content Types on different Stacks

EXAMPLES
  $ csdx content-type:compare-remote --origin-stack "xxxxxxxxxxxxxxxxxxx" --remote-stack "xxxxxxxxxxxxxxxxxxx" -content-type "home_page"
```

_See code: [src/commands/content-type/compare-remote.ts](https://github.com/contentstack/contentstack-cli-content-type/blob/v1.4.0/src/commands/content-type/compare-remote.ts)_

## `csdx content-type:details`

Display Content Type details

```
USAGE
  $ csdx content-type:details -c <value> [-s <value> | -a <value>] [-k <value> | ] [-a <value>] [-p]

FLAGS
  -a, --alias=<value>          Alias of the management token
  -a, --token-alias=<value>    Management token alias
  -c, --content-type=<value>   (required) Content Type UID
  -k, --stack-api-key=<value>  Stack API Key
  -p, --[no-]path              show path column
  -s, --stack=<value>          Stack UID

DESCRIPTION
  Display Content Type details

EXAMPLES
  $ csdx content-type:details --stack-api-key "xxxxxxxxxxxxxxxxxxx" --content-type "home_page"

  $ csdx content-type:details --alias "management token" --content-type "home_page"

  $ csdx content-type:details --alias "management token" --content-type "home_page" --no-path
```

_See code: [src/commands/content-type/details.ts](https://github.com/contentstack/contentstack-cli-content-type/blob/v1.4.0/src/commands/content-type/details.ts)_

## `csdx content-type:diagram`

Create a visual diagram of a Stack's Content Types

```
USAGE
  $ csdx content-type:diagram -o <value> -d portrait|landscape -t svg|dot [-s <value> | -a <value> | -a <value>] [-k
    <value> |  | ]

FLAGS
  -a, --alias=<value>          Alias of the management token
  -a, --token-alias=<value>    Management token alias
  -d, --direction=<option>     (required) [default: portrait] graph orientation
                               <options: portrait|landscape>
  -k, --stack-api-key=<value>  Stack API Key
  -o, --output=<value>         (required) full path to output
  -s, --stack=<value>          Stack UID
  -t, --type=<option>          (required) [default: svg] graph output file type
                               <options: svg|dot>

DESCRIPTION
  Create a visual diagram of a Stack's Content Types

EXAMPLES
  $ csdx content-type:diagram --stack-api-key "xxxxxxxxxxxxxxxxxxx" --output "content-model.svg"

  $ csdx content-type:diagram --alias "management token" --output "content-model.svg"

  $ csdx content-type:diagram --alias "management token" --output "content-model.svg" --direction "landscape"

  $ csdx content-type:diagram --alias "management token" --output "content-model.dot" --type "dot"
```

_See code: [src/commands/content-type/diagram.ts](https://github.com/contentstack/contentstack-cli-content-type/blob/v1.4.0/src/commands/content-type/diagram.ts)_

## `csdx content-type:list`

List all Content Types in a Stack

```
USAGE
  $ csdx content-type:list [-s <value> | -a <value> | -a <value>] [-k <value> |  | ] [-o title|modified]

FLAGS
  -a, --alias=<value>          Alias of the management token
  -a, --token-alias=<value>    Management token alias
  -k, --stack-api-key=<value>  Stack API Key
  -o, --order=<option>         [default: title] order by column
                               <options: title|modified>
  -s, --stack=<value>          Stack UID

DESCRIPTION
  List all Content Types in a Stack

EXAMPLES
  $ csdx content-type:list --stack-api-key "xxxxxxxxxxxxxxxxxxx"

  $ csdx content-type:list --alias "management token"

  $ csdx content-type:list --alias "management token" --order modified
```

_See code: [src/commands/content-type/list.ts](https://github.com/contentstack/contentstack-cli-content-type/blob/v1.4.0/src/commands/content-type/list.ts)_
<!-- commandsstop -->
