//load configuration settings
var sqlQueryFunctionURL;
var sqlTrasactionFunctionURL;

if (typeof window.DOMParser != "undefined") {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", 'web_config/config.xml', false);
    if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType('text/xml');
    }
    xmlhttp.send();
    config_xml = xmlhttp.responseXML;
    sqlQueryFunctionURL = config_xml.getElementsByTagName("sqlQueryFunctionURL")[0].childNodes[0].nodeValue;
    sqlTransactionFunctionURL = config_xml.getElementsByTagName("sqlTransactionFunctionURL")[0].childNodes[0].nodeValue;
}

else {
    config_xml = new ActiveXObject("Microsoft.XMLDOM");
    config_xml.async = "false";
    config_xml.load('config.xml');
    sqlQueryFunctionURL = config_xml.selectNodes("sqlQueryFunctionURL")[0].xml;
    sqlTransactionFunctionURL = config_xml.selectNodes("sqlTransactionFunctionURL")[0].xml;
} 

//now load the most popular recipes into an array
var get_popular_recipes = 'select top 5 RECIPE_NAME from Recipe_Access order by ACCESS_TIMESTAMP desc';

$.ajax({
    type: 'POST',
    url: sqlQueryFunctionURL,
    data: '{"sql_query": "' + get_popular_recipes + '"}',
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