﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Xml;
using System.Configuration;
using SQLManager;

[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class coulter_family_recipes : System.Web.Services.WebService
{
    SQLManager.SQLManager sql_manager;
    SQLCleaner cleaner;
    public coulter_family_recipes()
    {
        sql_manager = new SQLManager.SQLManager(ConfigurationManager.AppSettings["sqlConnectionString"]);
        cleaner = new SQLCleaner();
    }

    [WebMethod]
    public string load_ingredients(string data_0)
    {
        //data_0: recipe_context (name)
        cleaner.remove_quotes(ref data_0);
        return sql_manager.SQLQuery(String.Format(ConfigurationManager.AppSettings["load_ingredients_query"], data_0));
    }

    [WebMethod]
    public string load_directions(string data_0)
    {
        //data_0: recipe_context (name)
        cleaner.remove_quotes(ref data_0);
        return sql_manager.SQLQuery(String.Format(ConfigurationManager.AppSettings["load_directions_query"], data_0));
    }

    [WebMethod]
    public string get_popular_recipes()
    {
        return sql_manager.SQLQuery(ConfigurationManager.AppSettings["get_popular_recipes_query"]);
    }

    [WebMethod]
    public string get_recipes_by_category(string data_0)
    {
        return sql_manager.SQLQuery(String.Format(ConfigurationManager.AppSettings["get_recipes_by_category_query"], data_0));
    }

    [WebMethod]
    public string insert_recipe_name(string data_0)
    {
        //data_0: name of recipe
        cleaner.remove_quotes(ref data_0);
        return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["insert_recipe_name_query"], data_0));
    }

    [WebMethod]
    public string insert_subrecipe(string data_0, string data_1)
    {
        //data_0: parent recipe name
        //data_1: child recipe name
        cleaner.remove_quotes(ref data_0);
        cleaner.remove_quotes(ref data_1);
        return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["insert_subrecipe_query"], data_0, data_1));
    }

    [WebMethod]
    public string set_recipe_type(string data_0, string data_1)
    {
        //data_0: recipe name
        //data_1: recipe type
        cleaner.remove_quotes(ref data_0);
        cleaner.remove_quotes(ref data_1);
        return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["set_recipe_type_query"], data_0, data_1));
    }

    [WebMethod]
    public string insert_recipe_ingredient(string data_0, string data_1, string data_2, string data_3)
    {
        //data_0: recipe name
        //data_1: ingredient name
        //data_2: ingredient quantity
        //data_3: ingredient units
        cleaner.remove_quotes(ref data_0);
        cleaner.remove_quotes(ref data_1);
        cleaner.remove_quotes(ref data_2);
        cleaner.remove_quotes(ref data_3);
        //case where there are no units
        if(data_3 == "0")
            return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["insert_recipe_ingredient_no_unit_query"], data_0, data_1, data_2));
        else
            return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["insert_recipe_ingredient_query"], data_0, data_1, data_2, data_3));
    }

    [WebMethod]
    public string insert_recipe_direction(string data_0, string data_1, string data_2)
    {
        //data_0: recipe name
        //data_1: step number
        //data_2: step description
        cleaner.remove_quotes(ref data_0);
        cleaner.remove_quotes(ref data_1);
        cleaner.remove_quotes(ref data_2);
        return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["insert_recipe_direction_query"], data_0, data_1, data_2));
    }

    [WebMethod]
    public string get_unit_types()
    {
        return sql_manager.SQLQuery(ConfigurationManager.AppSettings["get_unit_types_query"]);
    }

    [WebMethod]
    public string get_recipe_names()
    {
        return sql_manager.SQLQuery(ConfigurationManager.AppSettings["get_recipe_names_query"]);
    }

    [WebMethod]
    public string get_recipe_categories()
    {
        return sql_manager.SQLQuery(ConfigurationManager.AppSettings["get_recipe_categories_query"]);
    }

    [WebMethod]
    public string update_recipe_access_time(string data_0)
    {
        //data_0: recipe name
        return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["update_recipe_access_time_query"], data_0, DateTime.Now));
    }

    [WebMethod]
    public string delete_recipe(string data_0)
    {
        //data_0: recipe name
        string result = "Recipe was deleted successfully.";
        XmlDocument doc = new XmlDocument();
        try
        {
            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_1"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove directions for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_2"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove ingredients for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_3"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove subrecipes for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_4"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove access time for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_5"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove class for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_6"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove name for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

        }

        catch(Exception e)
        {
            return e.Message;
        }

        return result;
        
    }

    [WebMethod]
    public string search_by_name(string data_0)
    {
        //data_0: search term (name of recipe)
        return sql_manager.SQLQuery(String.Format(ConfigurationManager.AppSettings["search_by_name_query"], data_0));
    }
}
