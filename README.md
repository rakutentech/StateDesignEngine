[![Node.js CI](https://github.com/rakutentech/StateDesignEngine/actions/workflows/node.js.yml/badge.svg)](https://github.com/rakutentech/StateDesignEngine/actions/workflows/node.js.yml)
# StateDesignEngine
This is a State Design Engine , help to create test design for State transition flow.
It gives , test coverage of all possible scenarios and also help to reduce the time in designing.



# install

``` shell
$ npm i 
```

# Usage
## command line
``` shell
# -h:help
# <file>:inputscript
# -s : switch
# -t : output type m:matrix/c:testcase coverage/d:diagram
node bin/index.js [-h] <file> [-s <0|1|2... (0:default)>] [-t <t|m|c|d (t:default)>]
```

## sample data
[Sample data](https://github.com/rakutentech/StateDesignEngine/blob/main/__tests__/testdata2.txt)

``` shell
$ cat __tests__/testdata2.txt
initial                  => "Default" ;
"Default" => "period"   : Display period data;
"Default" => "permanent"   : Display permanent data;
"period"   => "permanent"               : Display permanent data;
"permanent"               => "period"   : Display period data;
"permanent"   => "permanent" : Display permanent data;
```
## zero switch cases

```shell
$ node bin/index.js __tests__/testdata2.txt -t c
```

|#|State#1|Event#1|State#2|
|:--|:--|:--|:--|
|0|initial|[None]|Default|
|1|Default|Display period data|period|
|2|Default|Display permanent data|permanent|
|3|period|Display permanent data|permanent|
|4|permanent|Display period data|period|
|5|permanent|Display permanent data|permanent|

## zero switch matrix
```shell
$ node bin/index.js __tests__/testdata2.txt -t m
```
||[None]|Display period data|Display permanent data|Display permanent data|Display period data|Display permanent data|
|:---|:---|:---|:---|:---|:---|:---| 
|**initial**|Default||||||
|**Default**||period|permanent|||| 
|**period**||||permanent||| 
|**permanent**|||||period|permanent|

## one switch cases
```shell
$ node bin/index.js __tests__/testdata2.txt -t c -s 1
```

|#|State#1|Event#1|State#2|Event#2|State#3|
|:--|:--|:--|:--|:--|:--|
|0|initial|[None]|Default|Display period data|period|
|1|initial|[None]|Default|Display permanent data|permanent|
|2|Default|Display permanent data|permanent|Display period data|period|
|3|Default|Display period data|period|Display permanent data|permanent|
|4|Default|Display permanent data|permanent|Display permanent data|permanent|
|5|period|Display permanent data|permanent|Display period data|period|
|6|period|Display permanent data|permanent|Display permanent data|permanent|
|7|permanent|Display permanent data|permanent|Display period data|period|
|8|permanent|Display period data|period|Display permanent data|permanent|
|9|permanent|Display permanent data|permanent|Display permanent data|permanent|



{% include form.html %}
