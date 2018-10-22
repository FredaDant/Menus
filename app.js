
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
var menu_data = [];	
var menu = [];

app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'pug');

app.use(router);  
app.use(express.static(path.join(__dirname, 'public')));








router.get('/', getMenuList, function (req, res, next) {

  
     var item = [];
     for(var row of menu_data ){
       if(menu.length == 0) {
         var newItem = {Date: row.MenuDate, Items: item};
                  
         menu.push(newItem);
         

        
       }
       if(row.MenuDate != menu[menu.length -1].Date) {
        
        item = [];
         
         var newItem = {Date: row.MenuDate, Items: item};
         menu.push(newItem);
         
         
       }
       var newDish = {Dish: row.Item};
       
       menu[menu.length -1].Items.push(row.Item);
      /* var i = 0;
       while(i < menu[menu.length -1].Items.length) {
         console.log( menu[menu.length -1].Items[i]);
         i++;
       }
       */

       
       

       
       
     }
     
     fs.writeFileSync('./views/message.html', '<!DOCTYPE html><html><head><title>The Weekly Menu</title><link rel="stylesheet" href="/stylesheets/style.css"></head><body>', 'utf8', function(err){
      if (err) throw err;
     });
     fs.appendFileSync('./views/message.html', '<h1>Why the drama</h1>', function(err){
       if (err) throw err;
     });
    for(index = 0; index < menu.length ; index++ ) {
        //console.log(menu[index].Date);
        if(index ===0){
          fs.appendFileSync('./views/message.html', '\r\n<ul>', function(err){
            if(err) throw err;
          });
        }
        fs.appendFileSync('./views/message.html', '\r\n<li>'  + menu[index].Date + '</li>', function(err){
          if(err) throw err;
        });

            for(newindex = 0; newindex < menu[index].Items.length; newindex++) {
                //console.log(menu[index].Items[newindex])
                if(newindex === 0 ){
                fs.appendFileSync('./views/message.html','\r\n<ul>', function(err){
                  if(err) throw err;
                  });
                }
                fs.appendFileSync('./views/message.html', '\r\n<li> ' + menu[index].Items[newindex] + '</li>', function(err){
                  if(err) throw err;
                  });
              }
              fs.appendFileSync('./views/message.html', '\r\n</ul', function(err){
                if(err) throw err;
              });
      }  // end of outer loop

      fs.appendFileSync('./views/message.html', '\r\n</ul>\r\n</body>\r\n</html>', function(err){
        if(err) throw err;
      });
                
   /* res.render('menu_items', {
      title: 'The Weekly Menu',
      message: 'The List',
      menu_data,
      menu
     
  }); */

   res.sendfile('./views/message.html');
});

router.get('/index', function(req, res) {
    res.render('index')
});

router.post('/update',submitMenuItem, function (req, res) {  
	  var menu_data = req.body.menuDate;
      var description = req.body.theItem;
      
	  
    res.render('update', {
        title: 'All Quiet on the Western Front',
        menuDate: menu_data,
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
   /* function MenuItem(Menu_Date, Name, Display)
    {
    	this.Menu_Data = Menu_Date;
    	this.Name = Name;
      this.Display = Display;
    
   
    }  */
    
    function executeStatement() {

         var sql = "select dt_ofItem ,dish_name  FROM LA_COUNTY.dbo.mn_items order by dt_ofItem"; 
    	
         var Request = require('tedious').Request;
         request = new Request(sql, function (err, rowCount) {
              if (err) {
                   reject(err);
              } else {
           	   if(rowCount < 1) {
           		   callback(null, false);
           	   }
           	   else {
           		fulfill(menu_data);
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
                  //var item = new MenuItem(Menu_Date, column.value, Menu_Date + ": " + column.value);
                  var menu_stuff = {
                    MenuDate: Menu_Date,
                    Item: column.value
                    
                };
                  menu_data.push(menu_stuff);
            		  //menu_data.push("Date" Menu_Date ,"Item" column.value );
                      
            		  //item = null;
            	  }
              });
              

              
              
              
              
         });
              
         
         request.on('doneProc', function (rowCount, more, returnStatus, rows) {
        	  next(null, rows);
              connection.close()
             
              
              
              
    
             // console.log(menu_data[0].MenuDate);
            

              menu_data = [];

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
          fulfill(menu_date);
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
