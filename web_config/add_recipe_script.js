//when the add recipe page loads, we need to add options programatically to the select tag for the recipe type
//now load the most popular recipes into an array
var get_recipe_types = 'select * from Recipe_Categories';

$.ajax({
    type: 'POST',
    url: sqlQueryFunctionURL,
    data: '{"sql_query": "' + get_recipe_types + '"}',
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

                    //for each recipe, we want to add an option in the select box for recipe type
                    var new_opt = document.createElement('option');
                    new_opt.value = cols[j].childNodes[0].nodeValue;
                    new_opt.innerHTML = cols[j].childNodes[0].nodeValue;
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