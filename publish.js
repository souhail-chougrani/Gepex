var args = process.argv.slice(2);
var request = require('request');
var semver = require('semver');
var fs = require('fs');

var packageFile = require('./package.json');
var host = args[0];
var api =
  host === 'rma'
    ? 'http://192.168.0.6/gepexwebapi/'
    : host === 'local'
      ? 'http://192.168.0.101/apiwebgepexprod'
      : 'https://gepexnet.ma/api/';
var newDate = new Date().toLocaleString().replace(' ', ' à ');
var newVersion = semver.inc(packageFile.version, args[1]);

packageFile.date = newDate;
packageFile.version = newVersion;
fs.writeFileSync('package.json', JSON.stringify(packageFile));

console.log('uploading new version...');
request.post(
  api + '/Web/configurations/App_Version',
  {
    form: {
      version: newVersion,
      date_publication: newDate,
      host: host === 'rma' ? 'rma06' : host === 'local' ? 'local101' : host
    }
  },
  function(err, httpResponse, body) {
    if (err) {
      console.error('new version upload failed!');
      throw Error(err);
    }
    console.log('new version uploaded successfuly!');
  }
);

console.log(
  'Updated: new version: ' +
    newVersion +
    ' | date: ' +
    newDate +
    ' | host: ' +
    host
);
