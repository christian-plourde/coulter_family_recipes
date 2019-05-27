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
    console.log(recipe_name);
    var parent_recipe_name = document.getElementById("parent_recipe_name").value;
    console.log(parent_recipe_name);
    var ingredient_names = new Array();
    for (var i = 0; i < document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_input").length; i++)
    {
        ingredient_names.push(document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_input")[i].value);
    }
    console.log(ingredient_names);
    var ingredient_quantities = new Array();
    for (var i = 0; i < document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_quantity_input").length; i++)
    {
        ingredient_quantities.push(document.getElementById("ingredients_div").getElementsByClassName("add_ingredient_quantity_input")[i].value);
    }
    console.log(ingredient_quantities);
}