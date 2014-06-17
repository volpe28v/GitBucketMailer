var mongo = require('mongodb');
var db;
var table_name = 'commit_ranking';

module.exports.set_db = function(current_db){
  db = current_db;
};

// {name , point}
module.exports.add = function(data,callback){
  db.collection(table_name, function(err, collection) {
    collection.findOne({name: data.name},function(err, commits){
      if (commits != null){
        data.point = commits.point + data.point;
        collection.update( {_id: commits._id}, {'$set': data}, {safe: true}, function(){
          callback();
        });
      }else{
        collection.save( data, function(){
          callback();
        });
      }
    });
  });
};

module.exports.get = function(callback){
  db.collection(table_name, function(err, collection) {
    collection.find({}, {sort:{point: -1}}).toArray(function(err, results) {
      callback(results);
    });
  });
};
