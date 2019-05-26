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
var get_popular_recipes = 'select top 5 * from Recipe_Access order by ACCESS_TIMESTAMP';

$.ajax({
    type: 'POST',
    url: sqlQueryFunctionURL,
    data: '{"sql_query": "' + get_popular_recipes + '"}',
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    success: function (response) {

        console.log(response.d);
    },
    error: function (error) {
        console.log(error);
    }
});