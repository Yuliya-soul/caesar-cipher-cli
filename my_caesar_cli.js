#!/usr/bin/env node
const chalk = require('chalk');
const path =require('path');
const fs=require('fs');
const through2 = require('through2');
const { pipeline } = require('stream'); 
const Numbers  = require('./data/numbers');
const RuUp=require('./data/ruAlfUp');
const RuLow =require('./data/ruAlfLow');
const OtherSymbols =require('./data/otherSymbols');
const ParamObjTransformed=require('./utils/ParamObjTransform');
const EngUp  = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
const EngLow  = ['a','b','c','d','e','f','g','h','i','j','k','l','m','m','o','p','q','r','s','t','u','v','w','x','y','z'];
var EngUpEncrypt = Array(26); 
var EngLowEncrypt = Array(26); 
const path1 = ''+ParamObjTransformed.output.toString();
const UserStep=ParamObjTransformed.shift;

function initEncrypt() {
  if ((UserStep<0)||(UserStep===true))
    {process.stderr.write (chalk.red('Value of shift must be positive integer or you wrote wrong -s, --shift.So no encode/decode have done'));
    EngUpEncrypt = CezarEncrypt(0, EngUp);
    EngLowEncrypt = CezarEncrypt(0, EngLow);
    RuUpEncrypt = CezarEncrypt(0, RuUp);
    RuLowEncrypt = CezarEncrypt(0, RuLow);
    NumbersEncrypt = CezarEncrypt(0, Numbers);
    process.exit(1);
    }
 
  else{  
    EngUpEncrypt = CezarEncrypt(UserStep, EngUp);
    EngLowEncrypt = CezarEncrypt(UserStep, EngLow);
    RuUpEncrypt = CezarEncrypt(0, RuUp);
    RuLowEncrypt = CezarEncrypt(0, RuLow);
    NumbersEncrypt = CezarEncrypt(0, Numbers);
    }
} 
function CezarEncrypt(step, arr) {
  var CopyAlf = arr.slice();
  var i = 0;
  
  while ((i + step) < (CopyAlf.length)) {
    var buff = CopyAlf[i];
    CopyAlf[i] = CopyAlf[i + step];
    CopyAlf[i + step] = buff;
    i++;     
  }
  return CopyAlf;
}
function contains(symb, arr) {
  var letter = symb;
  pos = 0;
  for (var i = 0; i < arr.length; i++) {
    if (letter === arr[i]) {
      pos = i;
      return true;
      break;
    }
  }
}
function encrypt(text) {
  var result = '';
  for (var i = 0; i <= text.length; i++) {
    var symbol = text[i];
    if (contains(symbol, OtherSymbols)) {
      result += symbol;
    }
    if (contains(symbol, EngUp)) {
        symbol = EngUpEncrypt[pos];
        result += symbol;
    }
    if ((contains(symbol, EngLow))) {
        symbol = EngLowEncrypt[pos];
        result += symbol;
    }
    if (contains(symbol, Numbers)) {
      symbol = NumbersEncrypt[pos];
      result += symbol;
    }
    if (contains(symbol, RuUp)) {
        symbol = RuUpEncrypt[pos];
        result += symbol;
    }
    if ((contains(symbol, RuLow))) {
        symbol = RuLowEncrypt[pos];
        result += symbol;
    }
  }
  return result;
} 
function decrypt(text) {
  var result = '';
  for (var i = 0; i <= text.length; i++) {
    var symbol = text[i];
    if (contains(symbol, OtherSymbols)) {
      result += symbol;
    }
    if (contains(symbol, EngUpEncrypt)) {
        symbol = EngUp[pos];
        result += symbol;
    }
    if ((contains(symbol, EngLowEncrypt))) {
        symbol = EngLow[pos];
        result += symbol;
    }
    if (contains(symbol, Numbers)) {
      symbol = NumbersEncrypt[pos];
      result += symbol;
    }
    if (contains(symbol, RuUp)) {
        symbol = RuUpEncrypt[pos];
        result += symbol;
    }
    if ((contains(symbol, RuLow))) {
        symbol = RuLowEncrypt[pos];
        result += symbol;
    }
  }
  return result;
}

initEncrypt(); 

function transformStreams(input,output){
    const readableStream = input;
    const writeableStream = output;
    const transform=through2(function (chunk, enc, callback) {
        if(ParamObjTransformed.action=='encode'){
          var upperChunk = encrypt(chunk.toString());
          this.push(upperChunk)
          callback()
        }
        if(ParamObjTransformed.action=='decode'){
          var upperChunk = decrypt(chunk.toString());
          this.push(upperChunk)
          callback()
        }
        })
    pipeline(
      readableStream ,
      transform,
      writeableStream,
      (err) => {
        if (err) {
          process.stderr.write (chalk.red(`Encode/decode failed check input:"${ParamObjTransformed.input}"  `) , err);
          process.exit(1);
        } else {
          console.log(chalk.green(' Encode/decode succeeded '));
        }
      }
    ); 
}
function ActionWarning(action){
  process.stderr.write (chalk.redBright('"'+ action +'"' +' -  is wrong action '));
  process.exit(1);
}

///----------------------$ node my_caesar_cli --action encode/decode --shift 7-----------------------------------///

if((ParamObjTransformed.input==='empty')&(ParamObjTransformed.output==='empty')){
  if ((ParamObjTransformed.action==='encode')||(ParamObjTransformed.action==='decode')){
    const readableStream = process.stdin;
    const writeableStream = process.stdout;
    transformStreams(readableStream,writeableStream)
  }
  else {
    ActionWarning(ParamObjTransformed.action);
 
  } 
 
}
//--------------If the output file is missed - use stdout as an output destination.------------///

if ((ParamObjTransformed.output==='empty')&(ParamObjTransformed.input!='empty')){
  if ((ParamObjTransformed.action==='encode')||(ParamObjTransformed.action==='decode')){
    const readableStream = fs.createReadStream(path.resolve(__dirname,ParamObjTransformed.input), "utf8");
    const writeableStream = process.stdout;
    transformStreams(readableStream,writeableStream);
  }
    else {
      ActionWarning(ParamObjTransformed.action);
    }  
  }
//---------------If the input file is missed - use stdin as an input source.--------------///

if ((ParamObjTransformed.input==='empty')&(ParamObjTransformed.output!='empty')){
  if ((ParamObjTransformed.action==='encode')||(ParamObjTransformed.action==='decode')){
    fs.access(path1, fs.F_OK, (err) => {
      if (err) {
        process.stderr.write (chalk.red(`Write name of existing file instead of:  ${ParamObjTransformed.output}`));
        process.exit(1);
        return
      }
      const readableStream = process.stdin;
      const writeableStream = fs.createWriteStream(path.resolve(__dirname,ParamObjTransformed.output),{ flags: 'a'});;
      transformStreams(readableStream,writeableStream);
        }) 
  
  }
  else {
    ActionWarning(ParamObjTransformed.action);
  }  
  }
    
  //--------------------node my_caesar_cli -a encode -s 7 -i "./input.txt" -o "./output.txt"-----------///
  
  if ((ParamObjTransformed.output!=='empty')&(ParamObjTransformed.input!=='empty')){
  if ((ParamObjTransformed.action==='encode')||(ParamObjTransformed.action==='decode')){
     fs.access(path1, fs.F_OK, (err) => {
  if (err) {
    process.stderr.write (chalk.red(`Write name of existing file instead of::  ${ParamObjTransformed.output}`));
    process.exit(1);
    return
  }
  const readableStream = fs.createReadStream(path.resolve(__dirname,ParamObjTransformed.input), "utf8");
  const writeableStream =  fs.createWriteStream(path.resolve(__dirname,ParamObjTransformed.output),{ flags: 'a'});;
  transformStreams(readableStream,writeableStream);
}) 
   
    } 
  else {
    ActionWarning(ParamObjTransformed.action);
  } 
  }  
