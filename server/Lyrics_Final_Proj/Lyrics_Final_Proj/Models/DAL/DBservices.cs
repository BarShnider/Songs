using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using System.Text;
using Lyrics_Final_Proj.Models;

/// <summary>
/// DBServices is a class created by me to provides some DataBase Services
/// </summary>
public class DBservices
{

    public DBservices()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    //--------------------------------------------------------------------------------------------------
    // This method creates a connection to the database according to the connectionString name in the web.config 
    //--------------------------------------------------------------------------------------------------
    public SqlConnection connect(String conString)
    {

        // read the connection string from the configuration file
        IConfigurationRoot configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json").Build();
        string cStr = configuration.GetConnectionString("myProjDB");
        SqlConnection con = new SqlConnection(cStr);
        con.Open();
        return con;
    }

    //---------------------------------------------------------------------------------
    // Create the SqlCommand using a stored procedure
    //---------------------------------------------------------------------------------
    private SqlCommand CreateCommandWithStoredProcedure(String spName, SqlConnection con, Dictionary<string, object> paramDic)
    {

        SqlCommand cmd = new SqlCommand(); // create the command object

        cmd.Connection = con;              // assign the connection to the command object

        cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 

        cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds

        cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text

        if (paramDic != null)
            foreach (KeyValuePair<string, object> param in paramDic)
            {
                cmd.Parameters.AddWithValue(param.Key, param.Value);

            }


        return cmd;
    }





    //--------------------------------------------------------------------------------------------------
    // This method Reads all Songs
    //--------------------------------------------------------------------------------------------------
    public List<Song> ReadAllSongs()
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        cmd = CreateCommandWithStoredProcedure("Final_GetAllSongs", con, null);             // create the command


        List<Song> songsList = new List<Song>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Song s = new Song();
                s.Id = Convert.ToInt32(dataReader["Id"]);
                s.ArtistName = dataReader["artist"].ToString();
                s.Title = dataReader["song"].ToString();
                s.Link = dataReader["link"].ToString();
                s.Lyrics = dataReader["text"].ToString();









                songsList.Add(s);
            }
            return songsList;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }

    }

    //--------------------------------------------------------------------------------------------------
    // This method returns a list of songs for given artist
    //--------------------------------------------------------------------------------------------------
    public List<Song> GetSongsByArtist(string artistName)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@artistName", artistName);

        cmd = CreateCommandWithStoredProcedure("Final_GetSongsByArtist", con, paramDic);

        List<Song> songsList = new List<Song>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Song s = new Song();
                s.Id = Convert.ToInt32(dataReader["Id"]);
                s.ArtistName = dataReader["artist"].ToString();
                s.Title = dataReader["song"].ToString();
                s.Link = dataReader["link"].ToString();
                s.Lyrics = dataReader["text"].ToString();
                songsList.Add(s);
            }
            return songsList;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }


    //--------------------------------------------------------------------------------------------------
    // This method returns a list of songs for given Song Name
    //--------------------------------------------------------------------------------------------------
    public List<Song> GetSongsBySongName(string songName)
    {

        SqlConnection con;
        SqlCommand cmd;

        try
        {
            con = connect("myProjDB"); // create the connection
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }


        Dictionary<string, object> paramDic = new Dictionary<string, object>();
        paramDic.Add("@songName", songName);

        cmd = CreateCommandWithStoredProcedure("Songs_GetSongsBySongName", con, paramDic);

        List<Song> songsList = new List<Song>();

        try
        {
            SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

            while (dataReader.Read())
            {
                Song s = new Song();
                s.Id = Convert.ToInt32(dataReader["Id"]);
                s.ArtistName = dataReader["artist"].ToString();
                s.Title = dataReader["song"].ToString();
                s.Link = dataReader["link"].ToString();
                s.Lyrics = dataReader["text"].ToString();
                songsList.Add(s);
            }
            return songsList;
        }
        catch (Exception ex)
        {
            // write to log
            throw (ex);
        }

        finally
        {
            if (con != null)
            {
                // close the db connection
                con.Close();
            }
        }
    }



    /////////////////////////////////////////////////////////////////
    ///////////////////////// USER /////////////////////////////////
    ////////////////////////////////////////////////////////////////


    //--------------------------------------------------------------------------------------------------
    // This method returns a user by email
    //--------------------------------------------------------------------------------------------------
    //public User ReadUser(string email)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@email", email);

    //    cmd = CreateCommandWithStoredProcedure("SP_Get_User_By_Email", con, paramDic);
    //    SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

    //    try
    //    {
    //        User s = new User();
    //        while (dataReader.Read())
    //        {
    //            s.Id = Convert.ToInt32(dataReader["Id"]);
    //            s.Country = dataReader["countrt"].ToString();
    //            s.Email = dataReader["email"].ToString();
    //            s.Password = dataReader["email"].ToString();
    //            s.Phone = Convert.ToInt32(dataReader["Phone"]);
    //        }
    //        return s;

    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }

    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method Inserts a user to the Users table 
    ////--------------------------------------------------------------------------------------------------
    //public int InsertUser(User user)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@country", user.Country);
    //    paramDic.Add("@email", user.Email);
    //    paramDic.Add("@password", user.Password);
    //    paramDic.Add("@phone", user.Phone);

    //    cmd = CreateCommandWithStoredProcedure("SP_Add_User", con, paramDic);             // create the command

    //    try
    //    {
    //        // int numEffected = cmd.ExecuteNonQuery(); // execute the command
    //        int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
    //        return numEffected;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method checks if user exists 
    ////--------------------------------------------------------------------------------------------------
    //public int LoginUser(User user)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@email", user.Email);
    //    paramDic.Add("@password", user.Password);

    //    cmd = CreateCommandWithStoredProcedure("SP_Login_User", con, paramDic);             // create the command

    //    try
    //    {
    //        // int numEffected = cmd.ExecuteNonQuery(); // execute the command
    //        int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
    //        return numEffected;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method returns user 
    ////--------------------------------------------------------------------------------------------------
    //public User ReturnUser(User user)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@email", user.Email);

    //    cmd = CreateCommandWithStoredProcedure("SP_Return_User", con, paramDic);
    //    SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

    //    try
    //    {
    //        User s = new User();
    //        while (dataReader.Read())
    //        {
    //            s.Id = Convert.ToInt32(dataReader["Id"]);
    //            s.Country = dataReader["countrt"].ToString();
    //            s.Email = dataReader["email"].ToString();
    //            s.Password = dataReader["email"].ToString();
    //            s.Phone = Convert.ToInt32(dataReader["Phone"]);


    //        }
    //        return s;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method Update a user details 
    ////--------------------------------------------------------------------------------------------------
    //public int UpdateUser(User user)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@country", user.Country);
    //    paramDic.Add("@email", user.Email);
    //    paramDic.Add("@password", user.Password);
    //    paramDic.Add("@phone", user.Phone);

    //    cmd = CreateCommandWithStoredProcedure("SP_Update_User", con, paramDic);             // create the command

    //    try
    //    {
    //        int numEffected = cmd.ExecuteNonQuery(); // execute the command
    //        //int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
    //        return numEffected;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}


    ///////////////////////////////////////////////////////////////////
    /////////////////////////// Flat /////////////////////////////////
    //////////////////////////////////////////////////////////////////


    ////--------------------------------------------------------------------------------------------------
    //// This method Inserts a flat to the Flats table 
    ////--------------------------------------------------------------------------------------------------
    //public int InsertFlat(Flat flat)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@id", flat.Id);
    //    paramDic.Add("@city", flat.City);
    //    paramDic.Add("@address", flat.Address);
    //    paramDic.Add("@price", flat.Price);
    //    paramDic.Add("@bedRooms", flat.BedRooms);
    //    paramDic.Add("@imgUrl", flat.ImgUrl);
    //    paramDic.Add("@apartment", flat.ApartmentName);
    //    paramDic.Add("@reviewScore", flat.ReviewScore);
    //    paramDic.Add("@description", flat.Description);


    //    cmd = CreateCommandWithStoredProcedure("SP_Add_Flat", con, paramDic);             // create the command

    //    try
    //    {
    //        // int numEffected = cmd.ExecuteNonQuery(); // execute the command
    //        int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
    //        return numEffected;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method Reads all Flats
    ////--------------------------------------------------------------------------------------------------
    //public List<Flat> ReadFlats()
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }


    //    cmd = CreateCommandWithStoredProcedure("SP_Read_Flat", con, null);             // create the command


    //    List<Flat> flatsList = new List<Flat>();

    //    try
    //    {
    //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

    //        while (dataReader.Read())
    //        {
    //            Flat s = new Flat();
    //            s.Id = Convert.ToInt32(dataReader["Id"]);
    //            s.City = dataReader["city"].ToString();
    //            s.Address = dataReader["address"].ToString();
    //            s.Price = (float)Convert.ToDouble(dataReader["price"]);
    //            s.BedRooms = Convert.ToInt32(dataReader["bedRooms"]);
    //            s.ImgUrl = dataReader["imgUrl"].ToString();
    //            s.ApartmentName = dataReader["ApartmentName"].ToString();
    //            s.ReviewScore = (float)Convert.ToDouble(dataReader["ReviewScore"]);
    //            s.Description = dataReader["description"].ToString();
    //            flatsList.Add(s);
    //        }
    //        return flatsList;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }

    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method Delets Flat by id
    ////--------------------------------------------------------------------------------------------------
    //public int DeleteFlat(int id)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@id", id);

    //    cmd = CreateCommandWithStoredProcedure("SP_Remove_Flat", con, paramDic);             // create the command

    //    try
    //    {
    //        // int numEffected = cmd.ExecuteNonQuery(); // execute the command
    //        int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
    //        return numEffected;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method get Flat by price
    ////--------------------------------------------------------------------------------------------------
    //public List<Flat> PriceFlat(float price)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }


    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@price", price);

    //    cmd = CreateCommandWithStoredProcedure("SP_Flat_by_Price", con, paramDic);

    //    List<Flat> flatsList = new List<Flat>();

    //    try
    //    {
    //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

    //        while (dataReader.Read())
    //        {
    //            Flat s = new Flat();
    //            s.Id = Convert.ToInt32(dataReader["Id"]);
    //            s.City = dataReader["city"].ToString();
    //            s.Address = dataReader["address"].ToString();
    //            s.Price = (float)Convert.ToDouble(dataReader["price"]);
    //            s.BedRooms = Convert.ToInt32(dataReader["bedRooms"]);
    //            s.ImgUrl = dataReader["imgUrl"].ToString();
    //            s.ApartmentName = dataReader["apartmentName"].ToString();
    //            s.ReviewScore = (float)Convert.ToDouble(dataReader["reviewScore"]);
    //            s.Description = dataReader["description"].ToString();
    //            flatsList.Add(s);
    //        }
    //        return flatsList;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}


    ///////////////////////////////////////////////////////////////////
    /////////////////////////// Order /////////////////////////////////
    //////////////////////////////////////////////////////////////////

    ////--------------------------------------------------------------------------------------------------
    //// This method Inserts a order to the Orders table 
    ////--------------------------------------------------------------------------------------------------
    //public int InsertOrder(Order order)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@id", order.Id);
    //    paramDic.Add("@UserId", order.UserId);
    //    paramDic.Add("@FlatId", order.FlatId);
    //    paramDic.Add("@StartDate", order.StartDate);
    //    paramDic.Add("@EndDate", order.EndDate);

    //    cmd = CreateCommandWithStoredProcedure("SP_Insert_Orders_Yoni", con, paramDic);             // create the command

    //    try
    //    {
    //        // int numEffected = cmd.ExecuteNonQuery(); // execute the command
    //        int numEffected = Convert.ToInt32(cmd.ExecuteScalar()); // returning the id
    //        return numEffected;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }
    //}

    ////--------------------------------------------------------------------------------------------------
    //// This method Reads all Orders
    ////--------------------------------------------------------------------------------------------------
    //public List<Order> ReadOrders()
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }


    //    cmd = CreateCommandWithStoredProcedure("SP_Read_Orders ", con, null);             // create the command


    //    List<Order> OrdersList = new List<Order>();

    //    try
    //    {
    //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

    //        while (dataReader.Read())
    //        {
    //            Order s = new Order();
    //            s.Id = Convert.ToInt32(dataReader["Id"]);
    //            s.StartDate = Convert.ToDateTime(dataReader["startDate"]);
    //            s.EndDate = Convert.ToDateTime(dataReader["endDate"]);
    //            s.FlatId = Convert.ToInt32(dataReader["flatID"]);
    //            s.UserId = Convert.ToInt32(dataReader["userID"]);
    //            OrdersList.Add(s);
    //        }
    //        return OrdersList;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //    }

    //}


    //--------------------------------------------------------------------------------------------------
    // This method Reads all students above a certain age
    // This method uses the return value mechanism
    //--------------------------------------------------------------------------------------------------
    //public List<Student> ReadAboveAge(double age)
    //{

    //    SqlConnection con;
    //    SqlCommand cmd;

    //    try
    //    {
    //        con = connect("myProjDB"); // create the connection
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }


    //    Dictionary<string, object> paramDic = new Dictionary<string, object>();
    //    paramDic.Add("@age", age);
    //    paramDic.Add("@maxAllowedAge", 40);


    //    cmd = CreateCommandWithStoredProcedure("spReadStudentsAboveAge", con, paramDic);             // create the command
    //    var returnParameter = cmd.Parameters.Add("@returnValue", SqlDbType.Int);

    //    returnParameter.Direction = ParameterDirection.ReturnValue;


    //    List<Student> studentList = new List<Student>();

    //    try
    //    {
    //        SqlDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

    //        while (dataReader.Read())
    //        {
    //            Student s = new Student();
    //            s.Id = Convert.ToInt32(dataReader["Id"]);
    //            s.Name = dataReader["Name"].ToString();
    //            s.Age = Convert.ToDouble(dataReader["Age"]);
    //            studentList.Add(s);
    //        }



    //        return studentList;
    //    }
    //    catch (Exception ex)
    //    {
    //        // write to log
    //        throw (ex);
    //    }

    //    finally
    //    {
    //        if (con != null)
    //        {
    //            // close the db connection
    //            con.Close();
    //        }
    //        // note that the return value appears only after closing the connection
    //        var result = returnParameter.Value;
    //    }

    //}







}
