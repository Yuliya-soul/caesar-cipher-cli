 # Caesar cipher CLI tool

 **This is a command line application (CLI). CLI tool encodes and decodes a text by Caesar cipher. The application encrypts and decrypts only letters of the Latin alphabet. All other characters, including letters from alphabets of other languages, numbers, etc. remain unchanged.**

 ## Install
 
***
* download Caesar cipher CLI tool from this repository
* run the command line and go to the application folder 
* enter "npm install" or "npm i" 

***
## Use
 
***
* start the application
* CLI tool accept 4 options (short alias and full name):

-s, --shift: a shift

-i, --input: an input file

-o, --output: an output file

-a, --action: an action encode/decode

The action option takes the values  encode/decode and indicates what needs to be done with the incoming text: encrypt or decrypt.
Input and output options must have relative or absolute path to file.
To stop usage of ClI press Ctrl+C.

### Usage example:

> `$ node my_caesar_cli -a encode -s 7 -i "./input.txt" -o "./output.txt"`

> `$ node my_caesar_cli --action encode --shift 7 --input input.txt --output output.txt`

>input.txt This is secret. Message about "_" symbol!

>output.txt Aopz pz zljyla. Tlzzhnl hivba "_" zftivs!
***
