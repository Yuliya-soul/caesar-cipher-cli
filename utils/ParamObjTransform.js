#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));

const ParamObj=  {
    action: argv.action||argv.a,
    shift: argv.shift||argv.s,
    input: argv.input||argv.i,
    output:argv.output||argv.o,
  }; 
  const ParamObjTransformed={};
  
  if (ParamObj.action!=undefined){
    ParamObjTransformed.action=ParamObj.action}
  else {ParamObjTransformed.action='empty'};
  
  if (ParamObj.shift!=undefined)
    {ParamObjTransformed.shift=ParamObj.shift}
  else {ParamObjTransformed.shift=0};
  
  if (ParamObj.input!=undefined){
    ParamObjTransformed.input=ParamObj.input}
  else {ParamObjTransformed.input='empty'};
  
  if (ParamObj.output!=undefined){
    ParamObjTransformed.output=ParamObj.output}
  else {ParamObjTransformed.output='empty'};

  module.exports = ParamObjTransformed;  