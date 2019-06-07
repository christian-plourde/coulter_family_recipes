using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Xml;
using System.Configuration;
using SQLManager;

/// <summary>
/// Summary description for coulter_family_recipes
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class coulter_family_recipes : System.Web.Services.WebService
{
    SQLManager.SQLManager sql_manager;
    public coulter_family_recipes()
    {
        sql_manager = new SQLManager.SQLManager(ConfigurationManager.AppSettings["sqlConnectionString"]);
    }

    [WebMethod]
    public string SQLQuery(string sql_query)
    {
        return sql_manager.SQLQuery(sql_query);
    }

    [WebMethod]
    public string SQLTransaction(string sql_query)
    {
        return sql_manager.SQLTransaction(sql_query);
    }

}
