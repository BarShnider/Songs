namespace Lyrics_Final_Proj.Models;

public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime DateRegister { get; set; }

    public int Login()
    {
        DBservices dbs = new DBservices();
        int numCheck = dbs.LoginUser(this);
        return numCheck;
    }

    public bool Register()
    {
        DBservices dbs = new DBservices();
        if (dbs.CheckUserExistEmail(this.Email) == 1) // if there is a user with this email will return 1, else return 0
        {
            throw new Exception("email taken");
        }
        else
        {
            if (dbs.CheckUserExistName(this.Name) == 1) // if there is a user with this email will return 1, else return 0
                throw new Exception("Username taken");
            else
            {
                dbs.InsertUser(this);
                return true;
            }
        }
    }

    public static User ReadUserByEmail(string email)
    {
        DBservices dbs = new DBservices();
        return dbs.ReadUserByEmail(email);
    }

    public bool AddSongToFav(string email, string songName)
    {
        DBservices dbs = new DBservices();
        if (dbs.UserSong(email, songName) == 1)
        {
            return true;
        }
        return false;
    }

    public List<string> ArtistArr(string mail)
    {
        DBservices dbs = new DBservices();
        return dbs.ReturnArtistList(mail);
    }

    public static List<User> GetAllUsers()
    {
        DBservices dbs = new DBservices();
        return dbs.GetAllUsers();
    }

    public static List<Song> GetUserLikedSongs(string email)
    {
        DBservices dbs = new DBservices();
        return dbs.GetUserLikedSongs(email);
    }
}
