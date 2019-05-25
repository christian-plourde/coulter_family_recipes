using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Data.SqlClient;
using System.Xml;
using System.Configuration;

/// <summary>
/// Summary description for coulter_family_recipes
/// </summary>
[WebService(Namespace = "http://tempuri.org/")]
[WebServiceBinding(ConformsTo = WsiProfiles.BasicProfile1_1)]
// To allow this Web Service to be called from script, using ASP.NET AJAX, uncomment the following line. 
[System.Web.Script.Services.ScriptService]
public class coulter_family_recipes : System.Web.Services.WebService
{
    SqlCommand sql_command;
    string sqlConnectionString;
    string current_user;
    //CMQCLOGDOTNET.Logger logger;

    public coulter_family_recipes()
    {
        sqlConnectionString = ConfigurationManager.AppSettings["sqlConnectionString"];
        sql_command = new SqlCommand();
    }

    private void ConnectToDB(string conn_string)
    {
        sql_command.Connection = new SqlConnection(conn_string);
    }

    [WebMethod]
    public string SQLQuery(string sql_query)
    {
        SqlDataReader lecteurSQL;
        LinkedList<SQLRow> row_list = new LinkedList<SQLRow>();

        try
        {
            ConnectToDB(sqlConnectionString);
        }

        catch (Exception e)
        {
            return e.Message + " " + e.StackTrace;
        }

        try
        {
            //open the sql connection
            sql_command.Connection.Open();

            sql_command.CommandText = sql_query;
            lecteurSQL = sql_command.ExecuteReader();

            int cols = lecteurSQL.FieldCount;


            while (lecteurSQL.Read())
            {
                SQLRow new_row = new SQLRow();

                for (int i = 0; i < cols; i++)
                {
                    //if we fail to append the value it is because it is null

                    if (!lecteurSQL.IsDBNull(i))
                        new_row.append(lecteurSQL.GetValue(i).ToString());
                    else
                        new_row.append("");
                }

                row_list.AddLast(new_row);
            }

            sql_command.Connection.Close();

        }

        catch (Exception e)
        {
            sql_command.Connection.Close();
            return e.Message + " " + e.StackTrace;
        }

        int columns;

        try
        {
            columns = row_list.First.Value.ColumnCount;
        }

        catch (Exception e)
        {
            return e.Message + " " + e.StackTrace;
        }

        SQLRow[] row_array = row_list.ToArray<SQLRow>();
        string[,] toReturn = new string[row_array.Length, columns];

        for (int i = 0; i < row_array.Length; i++)
        {
            string[] sql_row_array = row_array[i].Cells.ToArray<string>();

            for (int j = 0; j < columns; j++)
            {
                toReturn[i, j] = sql_row_array[j];
            }
        }

        return arrayToXML(toReturn).InnerXml;

    }

    private XmlDocument arrayToXML(string[,] Array)
    {
        XmlDocument xml = new XmlDocument();
        XmlDeclaration xdec = xml.CreateXmlDeclaration("1.0", "UTF-8", null);
        XmlElement root = xml.DocumentElement;
        xml.InsertBefore(xdec, root);
        root = xml.CreateElement(string.Empty, "root", string.Empty);
        xml.AppendChild(root);

        for (int i = 0; i < Array.GetLength(0); i++)
        {

            XmlElement new_row;
            new_row = xml.CreateElement("row");
            root.AppendChild(new_row);

            for (int j = 0; j < Array.GetLength(1); j++)
            {
                XmlElement new_column;
                new_column = xml.CreateElement("col");
                new_column.InnerXml = Array[i, j];
                new_row.AppendChild(new_column);
            }
        }

        return xml;
    }

    [WebMethod]
    public string SQLTransaction(string sql_query)
    {
        XmlDocument xml = getPostResponseXml();

        try
        {
            ConnectToDB(sqlConnectionString);
        }
        catch (Exception E)
        {
            xml.SelectNodes("root/Accepted")[0].InnerXml = "false";
            xml.SelectNodes("root/Reason")[0].InnerXml = E.Message;
            return xml.InnerXml;
        }

        try
        {
            sql_command.Connection.Open();
            sql_command.CommandText = sql_query;
            sql_command.ExecuteNonQuery();

            sql_command.Connection.Close();
        }
        catch (Exception E)
        {
            sql_command.Connection.Close();
            xml.SelectNodes("root/Accepted")[0].InnerXml = "false";
            xml.SelectNodes("root/Reason")[0].InnerXml = E.Message;
            return xml.InnerXml;
        }

        xml.SelectNodes("root/Accepted")[0].InnerXml = "true";
        return xml.InnerXml;
    }

    private XmlDocument getPostResponseXml()
    {
        XmlDocument xml = new XmlDocument();
        XmlDeclaration xdec = xml.CreateXmlDeclaration("1.0", "UTF-8", null);
        XmlElement root = xml.DocumentElement;
        xml.InsertBefore(xdec, root);
        root = xml.CreateElement(string.Empty, "root", string.Empty);
        xml.AppendChild(root);

        XmlElement accepted = xml.CreateElement("Accepted");
        root.AppendChild(accepted);
        XmlElement reason = xml.CreateElement("Reason");
        root.AppendChild(reason);
        return xml;

    }




}
