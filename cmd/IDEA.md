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

1. --help option
2. be able to display more kinds of data: such as table
