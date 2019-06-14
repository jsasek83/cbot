var menudata = [{
    "date": "6/10/2019",
    "weekDay": "Monday",
    "location": "Menu for Building #2367",
    "menuItems": [
        {
            "type": "Breakfast",
            "name": "Hot Links"
        },
        {
            "type": "Entree",
            "name": "Fish and Chips"
        },
        {
            "type": "Starch",
            "name": "Rice Pilaf"
        },
        {
            "type": "Vegetable",
            "name": "Chefs ChOice"
        },
        {
            "type": "Protein Choice",
            "name": "Chefs Ch0ice Chicken"
        },
        {
            "type": "Misc.",
            "name": "Onion Rings"
        },
        {
            "type": "Soup",
            "name": "Dill potato"
        },
        {
            "type": "Pizza",
            "name": "Supreme"
        },
        {
            "type": "Hot Sandwich",
            "name": "Barbecue Chicken"
        },
        {
            "type": "Specialty Burger",
            "name": "Double Patty"
        },
        {
            "type": "Carver",
            "name": "Not Available"
        },
        {
            "type": "Display Cooking",
            "name": "Not Available"
        }
    ]
},{ 
    "date": "6/11/2019",
    "weekDay": "Tuesday",
    "location": "Menu for Building #2367",
    "menuItems": [
        {
            "type": "Breakfast",
            "name": "Breakfast Burritos"
        },
        {
            "type": "Entree",
            "name": "Smothered Beef Tips"
        },
        {
            "type": "Starch",
            "name": "Mashed Potatoes"
        },
        {
            "type": "Vegetable",
            "name": "Green Beans"
        },
        {
            "type": "Protein Choice",
            "name": "Blackened Salmon"
        },
        {
            "type": "Misc.",
            "name": "Cauliflower and Chickpea"
        },
        {
            "type": "Soup",
            "name": "Curry"
        },
        {
            "type": "Pizza",
            "name": "Chicken Noodle"
        },
        {
            "type": "Hot Sandwich",
            "name": "Alfredo Chicken"
        },
        {
            "type": "Specialty Burger",
            "name": "Ham, Roast Beef and"
        },
        {
            "type": "Carver",
            "name": "Cheddar Cheese"
        },
        {
            "type": "Display Cooking",
            "name": "Salmon Burger"
        }
    ]
},{ 
    "date": "6/12/2019",
    "weekDay": "Wednesday",
    "location": "Menu for Building #2367",
    "menuItems": [
        {
            "type": "Breakfast",
            "name": "Biscuits and Gravy"
        },
        {
            "type": "Entree",
            "name": "Teriyaki Chicken"
        },
        {
            "type": "Starch",
            "name": "Broccoli"
        },
        {
            "type": "Vegetable",
            "name": "Sweet-Chili Salmon"
        },
        {
            "type": "Protein Choice",
            "name": "Pot Stickers"
        },
        {
            "type": "Misc.",
            "name": "Vegetable Orzo"
        },
        {
            "type": "Soup",
            "name": "Chicken, Bacon and Ranch"
        },
        {
            "type": "Pizza",
            "name": "Veggie Lovers"
        },
        {
            "type": "Hot Sandwich",
            "name": "Bacon Cheddar"
        },
        {
            "type": "Specialty Burger",
            "name": "Not Available"
        },
        {
            "type": "Carver",
            "name": "Stir-Fry"
        }
    ]
},{
    "date": "6/13/2019",
    "weekDay": "Thursday",
    "location": "Menu for Building #2367",
    "menuItems": [
        {
            "type": "Breakfast",
            "name": "Chorizo Potatoes"
        },
        {
            "type": "Entree",
            "name": "Asado Chicken"
        },
        {
            "type": "Starch",
            "name": "Tomato-Basil Quinoa"
        },
        {
            "type": "Vegetable",
            "name": "Zucchini and Yellow"
        },
        {
            "type": "Protein Choice",
            "name": "Squash"
        },
        {
            "type": "Misc.",
            "name": "Chili-Lime cod"
        },
        {
            "type": "Soup",
            "name": "Grilled Salmon"
        },
        {
            "type": "Pizza",
            "name": "New Mexico Chili"
        },
        {
            "type": "Hot Sandwich",
            "name": "Garlic, Mushroom and"
        },
        {
            "type": "Specialty Burger",
            "name": "Spinach"
        },
        {
            "type": "Carver",
            "name": "Chef\u0027s Ch0ice"
        },
        {
            "type": "Display Cooking",
            "name": "Crispy Chicken"
        }
    ]
},{
    "date": "6/14/2019",
    "weekDay": "Friday",
    "location": "Menu for Building #2#2367",
    "menuItems": [
        {
            "type": "Breakfast",
            "name": "Cinnamon Rolls"
        },
        {
            "type": "Entree",
            "name": "Southern-Fried Pork Chops"
        },
        {
            "type": "Starch",
            "name": "Mac and Cheese"
        },
        {
            "type": "Vegetable",
            "name": "Com Cobbettes"
        },
        {
            "type": "Protein Choice",
            "name": "Cajun Salmon"
        },
        {
            "type": "Misc.",
            "name": "Cajun Chicken"
        },
        {
            "type": "Soup",
            "name": "Chefs Ch0ice"
        },
        {
            "type": "Pizza",
            "name": "Meat Lovers"
        },
        {
            "type": "Hot Sandwich",
            "name": "Tuna Melt"
        },
        {
            "type": "Specialty Burger",
            "name": "Turkey Burger"
        },
        {
            "type": "Carver",
            "name": "Not Available"
        },
        {
            "type": "Display Cooking",
            "name": "Not Available"
        }
    ]
}]

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

    var insertDocument = function(db, callback) {
    db.collection('deliMenus').insertMany(menudata, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the families collection.");
        callback();
    });
    };


    var url = 'mongodb://kraken-mongo:yBuLYi3NWSngoRKAsnftM4pizdwh4GEXVQSQhS1S9tqMh5XU3xfYobJ5cg81gkQh8B9zuoXBR3QP3lSQOQ5GAA%3D%3D@kraken-mongo.documents.azure.com:10255/?ssl=true';



    MongoClient.connect(url, function(err, client) {
        var db = client.db('kraken');
        insertDocument(db, function() {
                    client.close();

    })});



