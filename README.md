# sasshimi

create(options); return stream

create(input); return stream
create(input , options); return stream
create(input, output); return promise
create(input, output, options) return promise;
create(input, output, options, callback) return promise;

input =>
    - string 'stdin' 'data' 'filename'
        'data' & 'stdin' must defined cwd path option if you want import
        'filename' the pwd is extracted from dirname
    - readableStream


output =>
    - string 'stdout' 'filename'
    - writableStream
    - Callback function


sasshimi --input test/assets/imports.scss --path test/fixtures/node_modules --output stdout
