var Promise = require('bluebird');
var join = Promise.join;
var fs = Promise.promisifyAll(require("fs"));
var _ = require("lodash");

fs.readFileAsync("file.json").then(JSON.parse).then(function(val) {
    console.log(val);
}).catch(SyntaxError, function(e) {
    console.error("invalid json in file");
}).catch(function(e) {
    console.error(e);
});

var f2 = function() {
    return new Promise(function(resolve, reject) {
        resolve([1,2,3,4]);
    });
}
var f1 = function() {
    return Promise.reject(new Error('---------------test-error----------------'));
}

f1().catch(function(err){
    console.error(err.message);
});

var promises = [];
for (var i=0;i<10;i++) {
    var def = Promise.defer();
    def.resolve(i);
    promises.push(def.promise);
}

Promise.all(promises).then(function(){
    var results = [];
    _.map(arguments, function(argument) {
        results.push(argument);
    });
    console.log(_.flatten(results));
});

function f4(){
  var data = "1000";
  return Promise.delay("hello",100).then(function(rs){
    console.log('===rs===',rs);
    return data;
  })
}


f4().then(function(data){
  console.log('===data===', data);
});

Promise.resolve({name:'lenzhao'}).then(function(val){console.log('---',val);return {age:27}}).then(function(val){console.log('====',val)})

function f5() {
  return Promise.try(function(){return "---------------try--------"}).disposer(function(val){console.log('-----------disposer----'+val);});
}

Promise.using(f5(), function(val){console.log(val)});

console.log('+++++++++++=',__dirname);

Promise.each([1,3,4,5], function(v){
  console.log(v);
})

var ps = [];
for(var i=0; i< 10; i++) {
  ps.push(Promise.resolve(i));
}

Promise.each(ps, function(v) {
  console.log(">>>>>>>>>>>>>>>>"+v);
})
