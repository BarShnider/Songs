namespace Lyrics_Final_Proj.Models;

public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime dateRegister { get; set; }

    public bool Login(string email)
    {
        DBservices dbs = new DBservices();
        if (dbs.LoginUser(email) == 1)
            return true ;
        return false ;
    }
}
