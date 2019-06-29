using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Xml;
using System.Configuration;
using SQLManager;
using System.IO;

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
        if (data_3 == "0")
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
        XmlDocument xml_doc = new XmlDocument();
        string insert_result = sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["update_recipe_access_time_query"], data_0, DateTime.Now));
        xml_doc.LoadXml(insert_result);
        if (xml_doc.SelectNodes("root/Accepted")[0].InnerXml == "false")
            return sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["update_recipe_access_time_query_2"], DateTime.Now, data_0));
        else
            return insert_result;
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

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_7"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove image for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);

            doc.LoadXml(sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["delete_recipe_query_6"], data_0)));
            if (doc.SelectNodes("root/Accepted")[0].InnerXml != "true")
                throw new Exception("Failed to remove name for " + data_0 + ". " + doc.SelectNodes("root/Reason")[0].InnerXml);
        }

        catch (Exception e)
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

    [WebMethod]
    public string upload_file()
    {
        string ret = "";
        //StreamWriter log_writer = new StreamWriter(ConfigurationManager.AppSettings["log_location"]);
        HttpRequest request = this.Context.Request;
        HttpPostedFile file = request.Files["fileToUpload"];
        string recipe_name = request.Form.Get("web_page_name"); //this is required for the database update

        string FileName = file.FileName;
        //log_writer.WriteLine(DateTime.Now + " -- Uploading file " + FileName);
        //log_writer.Close();

        string ext = Path.GetExtension(FileName).ToLower();

        if (!(ext == ".png" || ext == ".jpg" || ext == ".jpeg"))// for only images file
        {
            ret = string.Format("File extension {0} not allowed.", ext);

            return ret;
        }

        if (FileName != "")
        {
            string path = ConfigurationManager.AppSettings["recipe_images_directory"];

            string filepath = "";
            if (FileName.Contains("jpg"))
                filepath = path + "/" + FileName;
            else
                filepath = path + "/" + FileName + ".jpg";
            file.SaveAs(filepath);

            //we need to link this to a particular recipe in the database
            string file_name_for_db = FileName;
            if (!file_name_for_db.Contains(".jpg"))
                file_name_for_db += ".jpg";
            string insert_result = sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["add_recipe_image_query"], recipe_name, file_name_for_db));
            XmlDocument xml_doc = new XmlDocument();
            xml_doc.LoadXml(insert_result);
            if(xml_doc.SelectNodes("root/Accepted")[0].InnerXml == "false")
            {
                //if the insert failed try an update instead
                //log_writer = new StreamWriter(ConfigurationManager.AppSettings["log_location"]);
                //log_writer.WriteLine(DateTime.Now + " -- " + xml_doc.SelectNodes("root/Reason")[0].InnerXml + "\n");
                //log_writer.Close();

                //before we do this we need to save the name of the file that was there previously so we can delete it
                ret += xml_doc.SelectNodes("root/Reason")[0].InnerXml;

                try
                {
                    xml_doc.LoadXml(sql_manager.SQLQuery(String.Format(ConfigurationManager.AppSettings["get_recipe_image_query"], recipe_name)));
                    string old_file_name = xml_doc.SelectNodes("root/row")[0].SelectNodes("col")[0].InnerXml;
                    File.Delete(ConfigurationManager.AppSettings["recipe_images_directory"] + "/" + old_file_name);
                    string update_result = sql_manager.SQLTransaction(String.Format(ConfigurationManager.AppSettings["update_recipe_image_query"], file_name_for_db, recipe_name));
                    xml_doc.LoadXml(update_result);

                    if(xml_doc.SelectNodes("root/Accepted")[0].InnerXml == "false")
                    {
                        //log_writer = new StreamWriter(ConfigurationManager.AppSettings["log_location"]);
                        //log_writer.WriteLine(DateTime.Now + " -- " + xml_doc.SelectNodes("root/Reason")[0].InnerXml + "\n");
                        //log_writer.Close();
                        ret += xml_doc.SelectNodes("root/Reason")[0].InnerXml;
                    }
                }

                catch(Exception e)
                {
                    //log_writer = new StreamWriter(ConfigurationManager.AppSettings["log_location"]);
                    //log_writer.WriteLine(DateTime.Now + " -- " + e.Message + "\n");
                    //log_writer.Close();
                }
                

                
            }
        }

        return ret;
    }

    [WebMethod]
    public string get_file_name_for_recipe_image(string data_0)
    {
        //data_0 : recipe name

        XmlDocument xdoc = new XmlDocument();
        string result_xml = sql_manager.SQLQuery(String.Format(ConfigurationManager.AppSettings["get_recipe_image_query"], data_0));

        try
        {
            xdoc.LoadXml(result_xml);
            return xdoc.SelectNodes("root/row")[0].SelectNodes("col")[0].InnerXml;
        }

        catch
        {
            return result_xml;
        }

    }


}
