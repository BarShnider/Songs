namespace Lyrics_Final_Proj.Models;

public class User
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public DateTime dateRegister { get; set; }

    public int Login()
    {
        DBservices dbs = new DBservices();
        int numCheck = dbs.LoginUser(this);
        return numCheck;
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
}
