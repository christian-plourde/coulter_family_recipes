function empty_element(id)
{
    $('#'+id).empty();
}

function category_mouse_enter()
{
    event.srcElement.style.color = "teal";
}

function category_mouse_out()
{
    event.srcElement.style.color = "#7FDBFF";
}

function category_click()
{
    //first empty the recipe list div since it will change
    empty_element(document.getElementById('recipe_list').id);

    var category_name = event.srcElement.innerHTML;
    var category_array = new Array();
    category_array.push(category_name);

    //TODO place this query in backend
    //select all the recipe names for that category and place them in the appropriate div
    $.ajax({
        type: 'POST',
        url: getRecipesByCategoryURL,
        data: generate_data_string(category_array),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            //we need to parse the xml document that we received in the response
            var parser = new DOMParser();
            var xml_doc;
            try {

                //first we need to add the appropriate title
                var recipe_list_title = document.createElement("p");
                recipe_list_title.className = "recipe_list_title";
                recipe_list_title.innerHTML = category_name + " Recipes";
                recipe_list.appendChild(recipe_list_title);

                var xml_doc = parser.parseFromString(response.d, "text/xml");
                var rows = xml_doc.getElementsByTagName("row");
                for (var i = 0; i < rows.length; i++) {
                    var cols = rows[i].getElementsByTagName("col");
                    for (var j = 0; j < cols.length; j++) {
                        //this allows us to get all the data in the xml file
                        //console.log(cols[j].childNodes[0].nodeValue);

                        //for each recipe, we want to add a paragraph in the recipe_list div
                        var new_par = document.createElement("p");
                        new_par.innerHTML = cols[j].childNodes[0].nodeValue;
                        document.getElementById("recipe_list").appendChild(new_par);
                        new_par.className = "recipe_name";
                        //we also need to set what happens when we click this new_paragraph
                        new_par.onclick = recipe_name_click;
                        
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
}

function plus_icon_mouse_enter()
{
    event.srcElement.src = "web_config/images/plus_icon_green.png";
}

function plus_icon_mouse_out()
{
    event.srcElement.src = "web_config/images/plus_icon_navy.png";
}

function plus_icon_click()
{
    location.href = "add_recipe.html";
}

function add_recipe_home_click()
{
    location.href = "home.html";
}

function add_new_ingredient_input()
{
    //when we click this we should add a row for a new ingredient
    var new_div = document.createElement("div");
    var ingredients_div = document.getElementById("ingredients_div");
    ingredients_div.appendChild(new_div);

    //to this new div we need to append 2 inputs and 1 select box
    var ingredient_name_input = document.createElement("input");
    ingredient_name_input.placeholder = "Ingredient";
    ingredient_name_input.className = "add_ingredient_input";
    new_div.appendChild(ingredient_name_input);

    var ingredient_quantity_input = document.createElement("input");
    ingredient_quantity_input.placeholder = "Quantity";
    ingredient_quantity_input.className = "add_ingredient_quantity_input";
    new_div.appendChild(ingredient_quantity_input);

    var ingredient_units = document.createElement("select");
    ingredient_units.className = "add_ingredient_unit_drop_down";

    //for the drop down we also need to add all the options
    var empty_option = document.createElement("option");
    empty_option.innerHTML = "Unit Type";
    empty_option.value = 0;
    ingredient_units.appendChild(empty_option);
    for (var i = 0; i < unit_types.length; i++)
    {
        var new_option = document.createElement("option");
        new_option.innerHTML = unit_types[i];
        new_option.value = unit_types[i];
        ingredient_units.appendChild(new_option);
    }

    new_div.appendChild(ingredient_units);
}

function add_new_direction_input()
{
    //here we need one input only that will have a text beside it that says the step number
    var new_div = document.createElement("div");
    var directions_div = document.getElementById("directions_div");
    directions_div.appendChild(new_div);

    var step_number = document.createElement("h");
    step_number.innerHTML = "Step Number " + (++steps_entered) + ":";
    step_number.className = "step_numbers";
    new_div.appendChild(step_number);

    var direction_input = document.createElement("input");
    direction_input.placeholder = "Direction";
    direction_input.className = "add_direction_input";
    new_div.appendChild(direction_input);
}

function add_recipe_button_click()
{
    //when this button is clicked we should get all the data that we need to do all the transactions prepared
    var recipe_name = document.getElementById("recipe_name").value;
    //console.log(recipe_name);
    var parent_recipe_name = document.getElementById("parent_recipe_name").value;
    //console.log(parent_recipe_name);
    var ingredient_names = new Array();
    for (var i = 0; i < document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_input").length; i++)
    {
        ingredient_names.push(document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_input")[i].value);
    }
    //console.log(ingredient_names);
    var ingredient_quantities = new Array();
    for (var i = 0; i < document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_quantity_input").length; i++)
    {
        ingredient_quantities.push(document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_quantity_input")[i].value);
    }
    //console.log(ingredient_quantities);
    var ingredient_units = new Array();
    for (var i = 0; i < document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_unit_drop_down").length; i++)
    {
        ingredient_units.push(document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_unit_drop_down")[i].value);
    }
    //console.log(ingredient_units);
    var directions = new Array();
    for (var i = 0; i < document.getElementById("directions_div").getElementsByClassName("add_direction_input").length; i++)
    {
        directions.push(document.getElementById("directions_div").getElementsByClassName("add_direction_input")[i].value);
    }
    //console.log(directions);
    var recipe_type = document.getElementById("recipe_type_select").value;
    //console.log(recipe_type);

    //now that all the data in the page is stored
    //we need to validate the inputs

    try
    {
        if (recipe_name.length == 0)
            throw "The recipe name cannot be empty.";

        for (var i = 0; i < ingredient_quantities.length; i++)
        {
            if (isNaN(ingredient_quantities[i]) || ingredient_quantities[i] == "")
                throw "The quantity '" + ingredient_quantities[i] + "' is not valid. Please enter a number."
        }

        //if a recipe has no ingredients this is invalid
        if (ingredient_names.length == 0)
            throw "A recipe must have at least one ingredient.";

        //if any of the ingredients is empty this is invalid
        try
        {
            for (var i = 0; i < ingredient_names.length; i++)
            {
                if (ingredient_names[i] == "")
                    throw "An ingredient name cannot be empty.";
            }
        }

        catch (error)
        {
            throw error;
        }

        //if a recipe has no directions this is invalid
        if (directions.length == 0)
            throw "A recipe must have at least one direction.";

        //if any of the directions is empty this is invalid
        try {
            for (var i = 0; i < directions.length; i++) {
                if (directions[i] == "")
                    throw "An direction cannot be empty.";
            }
        }

        catch (error) {
            throw error;
        }

    }

    catch (error)
    {
        alert(error);
        return;
    }

    //if we are here it means that the input is valid
    //if it is valid then we need to start doing the ajax calls
    //it is possible that an ajax call will fail (i.e. bad data in the sql transaction)
    //if this happens the transactions that passed must be rolled back
    //first add the new recipe name
    //this is critical since it is a fk for everything else
    var recipe_name_array = new Array();
    recipe_name_array.push(recipe_name);

    $.ajax({
        type: 'POST',
        url: insertRecipeNameURL,
        data: generate_data_string(recipe_name_array),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            //we need to parse the xml document that we received in the response
            var parser = new DOMParser();
            var xml_doc;
            try {

                var xml_doc = parser.parseFromString(response.d, "text/xml");
                var accepted = xml_doc.getElementsByTagName("Accepted")[0].childNodes[0].nodeValue;
                if (accepted == "false")
                    throw xml_doc.getElementsByTagName("Reason")[0].childNodes[0].nodeValue;
            }

            catch (error) {
                alert(error);
            }

            //next we need to add the parent recipe name if there is one
            if (parent_recipe_name != 0) {
                var parent_recipe_array = new Array();
                parent_recipe_array.push(parent_recipe_name, recipe_name);
                $.ajax({
                    type: 'POST',
                    url: insertSubRecipeURL,
                    data: generate_data_string(parent_recipe_array),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        //we need to parse the xml document that we received in the response
                        var parser = new DOMParser();
                        var xml_doc;
                        try {

                            var xml_doc = parser.parseFromString(response.d, "text/xml");
                            var accepted = xml_doc.getElementsByTagName("Accepted")[0].childNodes[0].nodeValue;
                            if (accepted == "false")
                                throw xml_doc.getElementsByTagName("Reason")[0].childNodes[0].nodeValue;
                        }

                        catch (error) {
                            alert(error);
                        }

                        //next we set the type of recipe that it is
                        var recipe_type_array = new Array();
                        recipe_type_array.push(recipe_name, recipe_type);
                        $.ajax({
                            type: 'POST',
                            url: setRecipeTypeURL,
                            data: generate_data_string(recipe_type_array),
                            dataType: 'json',
                            contentType: 'application/json; charset=utf-8',
                            success: function (response) {

                                //we need to parse the xml document that we received in the response
                                var parser = new DOMParser();
                                var xml_doc;
                                try {

                                    var xml_doc = parser.parseFromString(response.d, "text/xml");
                                    var accepted = xml_doc.getElementsByTagName("Accepted")[0].childNodes[0].nodeValue;
                                    if (accepted == "false")
                                        throw xml_doc.getElementsByTagName("Reason")[0].childNodes[0].nodeValue;
                                }

                                catch (error) {
                                    alert(error);
                                }

                            },
                            error: function (error) {
                                alert(error);
                            }
                        });

                    },
                    error: function (error) {
                        alert(error);
                    }
                });
            }

            //next we set the ingredients for that recipe
            //since each of the arrays will have the same length we can loop over the ingredient_names length but set all the values (quantity and type as well)
            for (var i = 0; i < ingredient_names.length; i++) {
                //since type can be empty, i.e. it has the value 0, if this is the case the query must be modified to put null in that position
                var recipe_ing_array = new Array();
                recipe_ing_array.push(recipe_name, ingredient_names[i], ingredient_quantities[i], ingredient_units[i]);

                $.ajax({
                    type: 'POST',
                    url: insertRecipeIngredientURL,
                    data: generate_data_string(recipe_ing_array),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        //we need to parse the xml document that we received in the response
                        var parser = new DOMParser();
                        var xml_doc;
                        try {

                            var xml_doc = parser.parseFromString(response.d, "text/xml");
                            var accepted = xml_doc.getElementsByTagName("Accepted")[0].childNodes[0].nodeValue;
                            if (accepted == "false")
                                throw xml_doc.getElementsByTagName("Reason")[0].childNodes[0].nodeValue;
                        }

                        catch (error) {
                            alert(error);
                        }

                    },
                    error: function (error) {
                        alert(error);
                    }
                });
            }

            //finally we set the directions for that recipe
            for (var i = 0; i < directions.length; i++) {
                //since type can be empty, i.e. it has the value 0, if this is the case the query must be modified to put null in that position
                var recipe_dir_array = new Array();
                recipe_dir_array.push(recipe_name, (i + 1), directions[i]);
                $.ajax({
                    type: 'POST',
                    url: insertRecipeDirectionURL,
                    data: generate_data_string(recipe_dir_array),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        //we need to parse the xml document that we received in the response
                        var parser = new DOMParser();
                        var xml_doc;
                        try {

                            var xml_doc = parser.parseFromString(response.d, "text/xml");
                            var accepted = xml_doc.getElementsByTagName("Accepted")[0].childNodes[0].nodeValue;
                            if (accepted == "false")
                                throw xml_doc.getElementsByTagName("Reason")[0].childNodes[0].nodeValue;
                        }

                        catch (error) {
                            alert(error);
                        }

                    },
                    error: function (error) {
                        alert(error);
                    }
                });
            }

            //once we have reached this point we know that the recipe was added successfully
            //we should display a message to say that it worked properly
            alert("Recipe was added successfully");

        },
        error: function (error) {
            alert(error);
        }
    });

}

function recipe_name_click()
{
    //this is what happens when we click on a recipe name on the home page
    location.href = "recipe.html?recipe=" + event.srcElement.innerHTML;
    //we should also update the last access for that recipe so it shows up in popular recipes

    var recipe_access_array = new Array();
    recipe_access_array.push(event.srcElement.innerHTML);
    $.ajax({
        type: 'POST',
        url: updateRecipeAccessTimeURL,
        data: generate_data_string(recipe_access_array),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function get_recipe_name_from_url()
{
    var url = location.href;
    var recipe_name = url.substr(url.indexOf('=') + 1);
    recipe_name = recipe_name.replace(/%20/g, ' ');
    return(recipe_name);
}

function delete_button_click()
{
    var confirm_result = confirm("The recipe will be deleted.");
    if (!confirm_result)
        return;

    var delete_recipe_array = new Array();
    delete_recipe_array.push(recipe_context);

    $.ajax({
        type: 'POST',
        url: deleteRecipeURL,
        data: generate_data_string(delete_recipe_array),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            alert(response.d);
            add_recipe_home_click();
        },
        error: function (error) {
            alert(error);
        }
    });
}

function search_click()
{
    //when we do this, the first thing we need to do is change the inner html of the recent recipes title to search results
    var recent_recipes_par = document.getElementsByClassName("recipe_list_title")[0];
    recent_recipes_par.innerHTML = "Search Results";

    //next we need to clear all of the child nodes of the div except for this one
    var recipe_names = document.getElementsByClassName("recipe_name");
    while (recipe_names.length != 0)
    {
        recipe_names = document.getElementsByClassName("recipe_name");
        document.getElementById("recipe_list").removeChild(recipe_names[0]);
    }

    //now that this is done we need to load in the results of the search using a query
    var search_term = new Array();
    search_term.push(document.getElementById("search_input").value);
    $.ajax({
        type: 'POST',
        url: searchByNameURL,
        data: generate_data_string(search_term),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {

            //we need to parse the xml document that we received in the response
            var parser = new DOMParser();
            var xml_doc;
            
            try {
                var xml_doc = parser.parseFromString(response.d, "text/xml");
                var rows = xml_doc.getElementsByTagName("row");
                for (var i = 0; i < rows.length; i++) {
                    var cols = rows[i].getElementsByTagName("col");
                    for (var j = 0; j < cols.length; j++) {
                        //this allows us to get all the data in the xml file
                        //console.log(cols[j].childNodes[0].nodeValue);

                        //for each recipe, we want to add a paragraph in the recent recipes div
                        var new_par = document.createElement("p");
                        new_par.innerHTML = cols[j].childNodes[0].nodeValue;
                        document.getElementById("recipe_list").appendChild(new_par);
                        new_par.className = "recipe_name";
                        new_par.onclick = recipe_name_click;
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
}

function camera_button_click()
{
    document.getElementById("add_recipe_image_div").style.display = "block";
}

function file_upload_submit()
{
    //function that is executed when an image is successfully uploaded to server
    document.getElementById("add_recipe_image_div").style.display = "none";
    if (document.getElementById("file_selector").files.length > 0)
    {
        alert("Image uploaded successfully");
        location.reload();
    }
        
    else
        alert("No file selected");
}