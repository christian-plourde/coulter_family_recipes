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
    var sql_query = "select Recipe_Names.RECIPE_NAME from Recipe_Names join Recipe_Class on Recipe_Names.RECIPE_NAME = Recipe_Class.RECIPE_NAME " +
        "join Recipe_Access on Recipe_Names.RECIPE_NAME = Recipe_Access.RECIPE_NAME " +
        "where Recipe_Class.RECIPE_CATEGORY = '" + category_name + "' order by ACCESS_TIMESTAMP desc";

    //select all the recipe names for that category and place them in the appropriate div
    $.ajax({
        type: 'POST',
        url: sqlQueryFunctionURL,
        data: '{"sql_query": "' + sql_query + '"}',
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
    try
    {
        //first add the new recipe name
        var new_recipe_name = "insert int Recipe_Names values ('" + recipe_name + "')";

        //select all the recipe names for that category and place them in the appropriate div
        $.ajax({
            type: 'POST',
            url: sqlTransactionFunctionURL,
            data: '{"sql_query": "' + new_recipe_name + '"}',
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
                console.log(error);
            }
        });

        //next we need to add the parent recipe name if there is one
        if (parent_recipe_name != 0)
        {
            
        }
    }

    catch (error)
    {
        console.log(error);
    }


}