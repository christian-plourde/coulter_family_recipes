//also when this page loads we need to create an array that contains all the units of measurement in the database
var unit_types = new Array();

$.ajax({
    type: 'POST',
    url: getUnitTypesURL,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (response) {

        //we need to parse the xml document that we received in the response
        var parser = new DOMParser();
        var xml_doc;
        try {
            var xml_doc = parser.parseFromString(response.d, "text/xml");
            var rows = xml_doc.getElementsByTagName("row");
            var recipe_type_select = document.getElementById("recipe_type_drop_down");
            for (var i = 0; i < rows.length; i++) {
                var cols = rows[i].getElementsByTagName("col");
                for (var j = 0; j < cols.length; j++) {
                    //this allows us to get all the data in the xml file
                    //console.log(cols[j].childNodes[0].nodeValue);

                    //for each recipe, we want to fill the units array
                    //we should always have an empty unit too
                    
                    unit_types.push(cols[j].childNodes[0].nodeValue);
                    
                }
            }
        }

        catch (error) {
            console.log(error);
        }

    },
    error: function (error) {
        console.log(error);
    }
});

var steps_entered = 0; //this tracks the number of steps in the new recipe

//we also need to add all of the names of the recipes to the parent recipe drop down so the user can select from approved choices
$.ajax({
    type: 'POST',
    url: getRecipeNamesURL,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (response) {

        //we need to parse the xml document that we received in the response
        var parser = new DOMParser();
        var xml_doc;
        try {
            var xml_doc = parser.parseFromString(response.d, "text/xml");
            var rows = xml_doc.getElementsByTagName("row");
            var parent_recipes = document.getElementById("parent_recipe_name");
            //also add an empty option
            var empty_option = document.createElement("option")
            empty_option.innerHTML = "Select Parent Recipe (Ex. Audrey Squares for Audrey Squares Icing)";
            empty_option.value = 0;
            parent_recipes.appendChild(empty_option);

            for (var i = 0; i < rows.length; i++) {
                var cols = rows[i].getElementsByTagName("col");
                for (var j = 0; j < cols.length; j++) {
                    //this allows us to get all the data in the xml file
                    //console.log(cols[j].childNodes[0].nodeValue);

                    //for each recipe, we want to add an option to the select box in the html to choose a parent recipe
                    var new_option = document.createElement("option");
                    new_option.innerHTML = cols[j].childNodes[0].nodeValue;
                    new_option.value = cols[j].childNodes[0].nodeValue;
                    parent_recipes.appendChild(new_option);

                }
            }
        }

        catch (error) {
            console.log(error);
        }

    },
    error: function (error) {
        console.log(error);
    }
});

//when the add recipe page loads, we need to add options programatically to the select tag for the recipe type
//now load the most popular recipes into an array
$.ajax({
    type: 'POST',
    url: getRecipeCategoriesURL,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (response) {

        //we need to parse the xml document that we received in the response
        var parser = new DOMParser();
        var xml_doc;
        try {
            var xml_doc = parser.parseFromString(response.d, "text/xml");
            var rows = xml_doc.getElementsByTagName("row");
            var recipe_type_select = document.getElementById("recipe_type_select");
            for (var i = 0; i < rows.length; i++) {
                var cols = rows[i].getElementsByTagName("col");
                for (var j = 0; j < cols.length; j++) {
                    //this allows us to get all the data in the xml file
                    //console.log(cols[j].childNodes[0].nodeValue);

                    //for each recipe, we want to add an option in the select box for recipe type
                    var new_opt = document.createElement("option");
                    new_opt.innerHTML = cols[j].childNodes[0].nodeValue;
                    new_opt.value = cols[j].childNodes[0].nodeValue;
                    recipe_type_select.appendChild(new_opt);

                }
            }
        }

        catch (error) {
            console.log(error);
        }

    },
    error: function (error) {
        console.log(error);
    }
}); 

