//this file contains general utility functions
function generate_data_string(data_array)
{
    //function to generate a data string for json post requests from an array
    var data_string = "{";
    for (var i = 0; i < data_array.length; i++)
    {
        if (i == data_array.length - 1)
            data_string += "\"data_" + i + "\": \"" + data_array[i] + "\"";
        else
            data_string += "\"data_" + i + "\": \"" + data_array[i] + "\", ";
    }
    data_string += "}";
    return data_string;
}

function convert_to_fraction(num)
{
    if (isNaN(num))
        return num;

    var dot_index = num.indexOf(".");
    var last_char = num.charAt(num.length - 1);

    if (num.includes(".00"))
        return num.substr(0, dot_index);

    if (num.includes(".88"))
    {
        if(num.substr(0,dot_index) != "0")
            return num.substr(0, dot_index) + " 7/8";
        return "7/8";
    }
        

    if (num.includes(".33"))
    {
        if (num.substr(0, dot_index) != "0")
            return num.substr(0, dot_index) + " 1/3";
        return "1/3";
    }
        

    if (num.includes(".66"))
    {
        if (num.substr(0, dot_index) != "0")
            return num.substr(0, dot_index) + " 2/3";
        return "2/3";
    }

    if (num.includes(".25"))
    {
        if (num.substr(0, dot_index) != "0")
            return num.substr(0, dot_index) + " 1/4";
        return "1/4";
    }

    if (num.includes(".50"))
    {
        if (num.substr(0, dot_index) != "0")
            return num.substr(0, dot_index) + " 1/2";
        return "1/2";
    }

    if (num.includes(".75")) {
        if (num.substr(0, dot_index) != "0")
            return num.substr(0, dot_index) + " 3/4";
        return "3/4";
    }

    return num;

}