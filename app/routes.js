var Deputes = require('./models/DeputeViews');
var age     = require('s-age');

module.exports = function(app) {

  app.get('/api/dataviz_bubble', function(req, res) {
    Deputes.aggregate([
        {
            $group: {
                _id: { "groupe": "$groupe.organisme","ratt_financier": "$parti_ratt_financier", "sexe": "$sexe" },
                count: {$sum: 1}
            }
        }
    ], function(err, deputeDetails) {
      if (err) 
        res.send(err);
      res.json(deputeDetails); // return all nerds in JSON format
    });
  });

  app.get('/api/hemicycle/form', function(req, res) {
    Deputes.aggregate([{"$group": { "_id": { sigle: "$groupe_sigle",groupe: "$groupe.organisme"} } },{ "$sort" : { "_id.groupe" : 1 }}]
      ,function(err, groupes) {
      if (err) 
        res.send(err);
      Deputes.distinct( "nb_mandats",function(err, nb_mandats) {
        if (err) 
          res.json(err);
        nb_mandats_sort = nb_mandats.sort();
        Deputes.distinct( "date_naissance",function(err, dates_naissance) {
          if (err) 
            res.json(err);
          dates_naissance_sort= dates_naissance.sort();
          Deputes.aggregate([{"$group": { "_id": { num: "$region.num",nom: "$region.nom"} } },{ "$sort" : { "_id.nom" : 1 }}]
            ,function(err, region) {
            if (err) 
              res.json(err);
            max_ddn = String(dates_naissance_sort[0])
            min_ddn = String(dates_naissance_sort[dates_naissance_sort.length-1])
            res.render('formulaire_hemicycle', 
              {
                political_group : groupes,
                region : region,
                minNbMandat : nb_mandats_sort[0],
                maxNbMandat : nb_mandats_sort[nb_mandats_sort.length-1],
                minAge : age(min_ddn.substr(0,4)+'-'+min_ddn.substr(4,2)+'-'+min_ddn.substr(6,2)),
                maxAge : age(max_ddn.substr(0,4)+'-'+max_ddn.substr(4,2)+'-'+max_ddn.substr(6,2))
              });
          });
        });
      });
      
    });
      
  });

  app.post('/api/hemicycle/search', function(req, res) {
    var criteres = req.body;
    var query = '';
    if (Object.keys(criteres).length > 0){
      query = {$and : []};
      Object.keys(criteres).forEach(function (key) {
        var subCondition;
        if (typeof criteres[key] == 'object'){
          subCondition ={ $or: []};
          criteres[key].forEach(function(item){
            subCondition.$or.push(getCondition(key,item));
          })
        }
        else{
          subCondition = getCondition(key,criteres[key]);
        }
        query.$and.push(subCondition);
      });
    }
    
    Deputes.find(query ,{ nom: 1, sexe: 1 , place_en_hemicycle:1,url_an :1},function(err, cursor) {
      if (err) 
        res.json(err);
      res.json(cursor);
    });
  }); 

}


function getCondition(key, value){
  var condition = {};
  var arrayKey = key.split('-');
  if(arrayKey.length>1){
    var subCondition = {};
    subCondition['$'+arrayKey[1]] = Number(value);
    condition[arrayKey[0]]= subCondition;
  }
  else{
    condition[key]= isNaN(value)?value:Number(value);
  }
  return condition;
}