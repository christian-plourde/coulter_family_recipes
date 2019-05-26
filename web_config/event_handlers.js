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
                console.log("error");
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