
//submit
var express = require('express');  
var bodyParser = require('body-parser');  
var app = express();  
app.use(bodyParser.json());
var tedious = require('tedious');
var Promise = require('promise');
app.use(bodyParser.urlencoded({ extended: false }));
var path = require('path');
var fs = require('fs');  



var router = express.Router();
var dataset = [];	

app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'pug');

app.use(router);  
app.use(express.static(path.join(__dirname, 'public')));








router.get('/', getMenuList, function (req, res, next) {
    res.render('menu_items', {
      title: 'The Weekly Menu',
      message: 'The List',
      dataset
  });
});

router.get('/index', function(req, res) {
    res.render('index')
});

router.post('/update',submitMenuItem, function (req, res) {  
	  var menu_date = req.body.menuDate;
      var description = req.body.theItem;
      //console.log(menu_date);
      //console.log(description);
	  
    res.render('update', {
        title: 'All Quiet on the Western Front',
        menuDate: menu_date,
        MenuItem: description 
      
          
	});

});


 // end of submitMenuItem


function getMenuList( req, res, next) {
	var promise = new Promise(function(fulfill, reject){
	
	
				
		
		
		
	
			
    var Connection = require('tedious').Connection;
    var Request = require('tedious').Request;
   
    
    var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));


    var connection = new Connection(config);
    


    connection.on('connect', function (err) {
    	    if (err) {
              console.log(err);
         } else {
              executeStatement();
         }
    });
    function MenuItem(Menu_Date, Name, Display)
    {
    	this.Menu_Date = Menu_Date;
    	this.Name = Name;
        this.Display = Display;
   
    }
    function executeStatement() {

         var sql = "select dt_ofItem ,dish_name  FROM LA_COUNTY.dbo.mn_items"; 
    	
         var Request = require('tedious').Request;
         request = new Request(sql, function (err, rowCount) {
              if (err) {
                   reject(err);
              } else {
           	   if(rowCount < 1) {
           		   callback(null, false);
           	   }
           	   else {
           		fulfill(dataset);
           	   }
              }
         });
       

         request.on('row', function (columns) {
        	 var Menu_Date = ""
        	 
        	 
              columns.forEach(function (column) {
            	  
            	  if(column.metadata.colName=== "dt_ofItem"){
            		  
            		  Menu_Date = column.value.toDateString();
                      
                   }
            	  if(column.metadata.colName==="dish_name") {
                      //console.log(column.value);
                      //console.log('WTF');
            		  var item = new MenuItem(Menu_Date, column.value, Menu_Date + ": " + column.value);
            		  dataset.push(item);
                      //console.log(item.Menu_Date, item.Name);
            		  item = null;
            	  }
              });
              

              
              
              
              
         });
              
         
         request.on('doneProc', function (rowCount, more, returnStatus, rows) {
        	  next(null, rows);
              connection.close()
              
              
              dataset = [];

         });

         connection.execSql(request);
    }
	});
}  // end getclients



function submitMenuItem( req, res, next) {
    

var menu_date = req.body.menuDate;
var description = req.body.theItem;
    
var Connection = require('tedious').Connection;

var config = JSON.parse(fs.readFileSync('./config/config.json', 'utf8'));

 var connection = new Connection(config);

  var connection = new Connection(config);

  connection.on('connect', function(err) {

      executeStatement();
    });

    
    
 

  function executeStatement() {
    var sql = "insert LA_County.dbo.mn_items (dt_ofItem, dish_name) values ('" + menu_date + "','" + description + "')"
    var Request = require('tedious').Request;
    request = new Request(sql, function(err, rowCount) {
      if (err) {
        reject(err);
      } else {
        if(rowCount < 1) {
            callback (null, false);
      }
      else {
          fulfill(dataset);
      }
    }
    });
  

    request.on('row', function(columns) {
      columns.forEach(function(column) {
        //console.log(column.value);
      });
    });
    
    request.on('doneProc', function (rowCount, more, returnStatus, rows) {
        next(null, rows);

            connection.close()
              
        

         });  
    
    

    connection.execSql(request);
  }    

} // end of submitMenuItem








app.listen(3030);  
module.exports = app;  
