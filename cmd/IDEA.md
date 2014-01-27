version 0.2 expectations: 
===

1. develop api to analyze the following types of command:

  command value
  
  command -para1 -para2 -para3 (value)?
  
  command -para1 value1 -para2 value2 ......
  
  command -singleCharacterPara1SingleCharacterPara2SingleCharacterPara3(only used for flag)
  
  command --help
  
  So a command is processed in this way:
    1. get command (check existence)
    2. get a list of key(s)/value(s)
    3. pass this list to processor(param list check is done here)
    4. get result


  So params defination is like this:
  
  for a command, the following properties are required:
  
  require value
  
  for a param, the following properties are required:

    1. can combine
    2. require a value


version 0.3 expectations:
===

1. be able to display more kinds of data: such as table [ok]
2. --help option [ok]
3. clear command [ok]
4. select and paste [ok] [because I can't modify clipboard without user click, and the clicked button has to been covered by an invisible flash button. So I wanna use in-page select and paste: use a js global variable as the clipboard.]
#5. command hint
#6. shortcut for a command
5. tab to list commands [ok]

version 0.4 expectations:
===

1. double quotes to group value with inner spaces
2. add force no option command