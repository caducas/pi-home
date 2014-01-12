var fs = require('fs'),
    xml2js = require('xml2js');


var parser = new xml2js.Parser();

fs.readFile('/var/lib/wfrog/wfrog-current.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log(result);
        console.log('Done');
        console.log(result.current);
        console.log(result.current.thInt[0].temp);
        console.log("inner temp:" + result.current.thInt[0].temp);
        console.log("outer temp:" + result.current.th1.temp);
    });
});