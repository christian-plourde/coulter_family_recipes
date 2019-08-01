using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

public class SQLCleaner
{
    public SQLCleaner()
    {
                
    }

    public void remove_quotes(ref string sql_param)
    {
        sql_param = sql_param.Replace("'", "''");
    }
}