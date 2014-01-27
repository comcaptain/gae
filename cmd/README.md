Web Javascript CMD UI
===

for cmd use


version 0.1:

1. basic ui is implemented

2. commands supported:

    up arrow and down arrow keyboard: show command history

3. cmdConsole options:

    info: The top readonly information content.


version 0.2: 

1. Now input command can be transformed into optionObjValuePairList

2. Command supports "valueRequired". Command option supports "valueRequired" and "canCombine". "CanCombine" can only be applied to single-character option. The check of these properties has been done in 1

others:

   a javascript version "var_dump" is added, just dump(something) will print something in console
   
   
version 0.3(developing, 60%):

1. be able to display more kinds of data: such as table [ok]

   Supports withBorder property
2. --help option [ok]
3. clear command [ok]
4. select and paste [ok]
5. tab to list commands [ok]