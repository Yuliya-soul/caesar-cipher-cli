


export default function transformStreams(input,output){
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
          process.stderr.write (`Encode/decode failed check input:"${ParamObjTransformed.input}"  ` , err);
          process.exit(1);
        } else {
          console.log(' Encode/decode succeeded');
        }
      }
    ); 
}