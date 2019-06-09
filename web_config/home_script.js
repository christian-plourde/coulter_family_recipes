//now load the most popular recipes into an array

$.ajax({
    type: 'POST',
    url: getPopularRecipesURL,
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (response) {

        //we need to parse the xml document that we received in the response
        var parser = new DOMParser();
        var xml_doc;
        try
        {
            var xml_doc = parser.parseFromString(response.d, "text/xml");
            var rows = xml_doc.getElementsByTagName("row");
            for (var i = 0; i < rows.length; i++)
            {
                var cols = rows[i].getElementsByTagName("col");
                for (var j = 0; j < cols.length; j++)
                {
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

        catch (error)
        {
            console.log("error");
        }
        
    },
    error: function (error) {
        console.log(error);
    }
});

