//load configuration settings
var loadIngredientsURL;
var getPopularRecipesURL;
var getRecipesByCategoryURL;
var insertRecipeNameURL;
var insertSubRecipeURL;
var setRecipeTypeURL;
var insertRecipeIngredientURL;
var insertRecipeDirectionURL;
var getUnitTypesURL;
var getRecipeNamesURL;
var getRecipeCategoriesURL;
var updateRecipeAccessTimeURL;
var loadDirectionsURL;
var deleteRecipeURL;

if (typeof window.DOMParser != "undefined") {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", 'web_config/config.xml', false);
    if (xmlhttp.overrideMimeType) {
        xmlhttp.overrideMimeType('text/xml');
    }
    xmlhttp.send();
    config_xml = xmlhttp.responseXML;
    loadIngredientsURL = config_xml.getElementsByTagName("loadIngredientsURL")[0].childNodes[0].nodeValue;
    loadDirectionsURL = config_xml.getElementsByTagName("loadDirectionsURL")[0].childNodes[0].nodeValue;
    getPopularRecipesURL = config_xml.getElementsByTagName("getPopularRecipesURL")[0].childNodes[0].nodeValue;
    getRecipesByCategoryURL = config_xml.getElementsByTagName("getRecipesByCategoryURL")[0].childNodes[0].nodeValue;
    insertRecipeNameURL = config_xml.getElementsByTagName("insertRecipeNameURL")[0].childNodes[0].nodeValue;
    insertSubRecipeURL = config_xml.getElementsByTagName("insertSubRecipeURL")[0].childNodes[0].nodeValue;
    setRecipeTypeURL = config_xml.getElementsByTagName("setRecipeTypeURL")[0].childNodes[0].nodeValue;
    insertRecipeIngredientURL = config_xml.getElementsByTagName("insertRecipeIngredientURL")[0].childNodes[0].nodeValue;
    insertRecipeDirectionURL = config_xml.getElementsByTagName("insertRecipeDirectionURL")[0].childNodes[0].nodeValue;
    getUnitTypesURL = config_xml.getElementsByTagName("getUnitTypesURL")[0].childNodes[0].nodeValue;
    getRecipeNamesURL = config_xml.getElementsByTagName("getRecipeNamesURL")[0].childNodes[0].nodeValue;
    getRecipeCategoriesURL = config_xml.getElementsByTagName("getRecipeCategoriesURL")[0].childNodes[0].nodeValue;
    updateRecipeAccessTimeURL = config_xml.getElementsByTagName("updateRecipeAccessTimeURL")[0].childNodes[0].nodeValue;
    deleteRecipeURL = config_xml.getElementsByTagName("deleteRecipeURL")[0].childNodes[0].nodeValue;
}

else {
    config_xml = new ActiveXObject("Microsoft.XMLDOM");
    config_xml.async = "false";
    config_xml.load('config.xml');
    loadIngredientsURL = config_xml.selectNodes("loadIngredientsURL")[0].xml;
    loadDirectionsURL = config_xml.selectNodes("loadDirectionsURL")[0].xml;
    getPopularRecipesURL = config_xml.selectNodes("getPopularRecipesURL")[0].xml;
    getRecipesByCategoryURL = config_xml.selectNodes("getRecipesByCategoryURL")[0].xml;
    insertRecipeNameURL = config_xml.selectNodes("insertRecipeNameURL")[0].xml;
    insertSubRecipeURL = config_xml.selectNodes("insertSubRecipeURL")[0].xml;
    setRecipeTypeURL = config_xml.selectNodes("setRecipeTypeURL")[0].xml;
    insertRecipeIngredientURL = config_xml.selectNodes("insertRecipeIngredientURL")[0].xml;
    insertRecipeDirectionURL = config_xml.selectNodes("insertRecipeDirectionURL")[0].xml;
    getUnitTypesURL = config_xml.selectNodes("getUnitTypesURL")[0].xml;
    getRecipeNamesURL = config_xml.selectNodes("getRecipeNamesURL")[0].xml;
    getRecipeCategoriesURL = config_xml.selectNodes("getRecipeCategoriesURL")[0].xml;
    updateRecipeAccessTimeURL = config_xml.selectNodes("updateRecipeAccessTimeURL")[0].xml;
    deleteRecipeURL = config_xml.selectNodes("deletRecipeURL")[0].xml;
} 
