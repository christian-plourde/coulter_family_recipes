var recipe_context = get_recipe_name_from_url();
var ingredient_quantities = new Array(); //to allow doubling we need to keep the true value

//now that we have the context of the recipe we need to load and format all the appropriate data for that recipe
function load_ingredients()
{
    //we need to load all the ingredients that correspond to the recipe that the page was loaded for
    var load_ingredients_params = new Array();
    load_ingredients_params.push(recipe_context);
    $.ajax({
        type: 'POST',
        url: loadIngredientsURL,
        data: generate_data_string(load_ingredients_params),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            //we need to parse the xml document that we received in the response
            var parser = new DOMParser();
            var xml_doc;
            try {

                var xml_doc = parser.parseFromString(response.d, "text/xml");
                var ingredients_div = document.getElementById("ingredients_list");
                var rows = xml_doc.getElementsByTagName("row");
                var ingredients_table = document.createElement('table');
                ingredients_table.id = "ingredients_table";
                ingredients_div.appendChild(ingredients_table);
                for (var i = 0; i < rows.length; i++) {
                    var cols = rows[i].getElementsByTagName("col");
                    var ing_name;
                    var ing_quantity;
                    var ing_unit;
                    var new_row = ingredients_table.insertRow(i);
                    for (var j = 0; j < cols.length; j++)
                    {
                        //this allows us to get all the data in the xml file

                        //we want to add a new table containing the information about all the ingredients
                        //if the nodeValue is null then it will be empty and we should replace with the empty string
                        
                        try
                        {
                            ing_name = cols[0].childNodes[0].nodeValue;
                            ing_quantity = cols[1].childNodes[0].nodeValue;
                            ingredient_quantities.push(ing_quantity);
                            ing_unit = cols[2].childNodes[0].nodeValue;
                        }

                        catch
                        {
                            ing_unit = "";
                        }
                        
                    }
                    var new_cell = new_row.insertCell(0);
                    new_cell.className = "ingredients_table_cell";
                    new_cell = new_row.insertCell(1);
                    new_cell.className = "ingredients_table_cell";
                    new_cell = new_row.insertCell(2);
                    new_cell.className = "ingredients_table_cell";
                    new_row.cells[0].innerHTML = convert_to_fraction(ing_quantity);
                    new_row.cells[1].innerHTML = ing_unit;
                    new_row.cells[2].innerHTML = ing_name;
                }

                var get_image_file_params = new Array();
                get_image_file_params.push(recipe_context);

                //when doing this we also need to load the image for the recipe
                $.ajax({
                    type: 'POST',
                    url: getImageFilePathURL,
                    data: generate_data_string(get_image_file_params),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        document.getElementById("recipe_image").src = recipeImagesDirectoryURL + response.d;
                        

                        //finally we should set the properties of the recipe image
                        document.getElementById("recipe_image").style.height = document.getElementById("ingredients_list").style.height;
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            }

            catch (error) {
                console.log(error);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function load_directions()
{
    //we need to load all the directions that correspond to the recipe that the page was loaded for
    var load_directions_params = new Array();
    load_directions_params.push(recipe_context);
    $.ajax({
        type: 'POST',
        url: loadDirectionsURL,
        data: generate_data_string(load_directions_params),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            //we need to parse the xml document that we received in the response
            var parser = new DOMParser();
            var xml_doc;
            try {

                var xml_doc = parser.parseFromString(response.d, "text/xml");

                var directions_div = document.getElementById("directions_list");
                var rows = xml_doc.getElementsByTagName("row");
                var directions_table = document.createElement('table');
                directions_table.className = "directions_table";
                
                var current_recipe_name = rows[0].getElementsByTagName("col")[0].childNodes[0].nodeValue; //the name of the recipe we are on
                var new_directions_header = document.createElement("p");
                new_directions_header.className = "directions_header";
                new_directions_header.innerHTML = current_recipe_name + " Procedure:";
                directions_div.appendChild(new_directions_header);

                var row_index = 0;

                for (var i = 0; i < rows.length; i++) {

                    var cols = rows[i].getElementsByTagName("col");
                    
                    if (cols[0].childNodes[0].nodeValue != current_recipe_name) //if the recipe name has changed (i.e. subrecipe)
                    {
                        directions_div.appendChild(directions_table);
                        directions_table = document.createElement("table");
                        directions_table.className = "directions_table";

                        current_recipe_name = cols[0].childNodes[0].nodeValue;
                        var new_directions_header = document.createElement("p");
                        new_directions_header.className = "directions_header";
                        new_directions_header.innerHTML = current_recipe_name + " Procedure:";
                        directions_div.appendChild(new_directions_header);
                        row_index = 0;
                    }

                    var new_row = directions_table.insertRow(row_index);
                    row_index++;

                    for (var j = 1; j < cols.length; j++) {
                        //this allows us to get all the data in the xml file

                        //we want to add a new table containing the information about all the directions
                        var new_cell = new_row.insertCell(j - 1);
                        new_cell.className = "directions_table_cell";
                        new_cell.innerHTML = cols[j].childNodes[0].nodeValue;

                        if (j == 1)
                        {
                            //if this is the case, then this is the step number. It should have a dot after the number
                            new_cell.innerHTML += ".";
                            //also it should be bold so that it stands out
                            new_cell.style.fontWeight = "bold";
                        }

                    }
                
                }

                directions_div.appendChild(directions_table);
                
            }

            catch (error) {
                console.log(error);
            }

        },
        error: function (error) {
            console.log(error);
        }
    });
}