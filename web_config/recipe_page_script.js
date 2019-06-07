var recipe_context = get_recipe_name_from_url();

//now that we have the context of the recipe we need to load and format all the appropriate data for that recipe
function load_ingredients()
{
    //we need to load all the ingredients that correspond to the recipe that the page was loaded for
    var sql_query = "select INGREDIENT_NAME, QUANTITY, QUANTITY_TYPE from Recipe_Ingredients where RECIPE_NAME = '" + recipe_context + "'";
    //TODO put this query in backend
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

                var xml_doc = parser.parseFromString(response.d, "text/xml");
                console.log(xml_doc);
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