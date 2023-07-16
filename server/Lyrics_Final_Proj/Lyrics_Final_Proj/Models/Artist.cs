namespace Lyrics_Final_Proj.Models
{
    public class Artist
    {
        public string Name { get; set; }
        public int FavoriteCount {get;set; }

        public int AddRemoveLike(string mail, string name)
        {
            DBservices dBservices = new DBservices();
            return dBservices.AddRemoveLike(mail,name);

        }

        public List<string> ArtistsNames()
        {
            DBservices dbs = new DBservices();
            return dbs.ReturnAllArtists();
        }

        public List<string> TopArtists()
        {
            DBservices dbs = new DBservices();
            return dbs.ReturnTopArtists();
        }

        public List<string> GetArtistsWord(string word)
        {
            DBservices dbs = new DBservices();
            return dbs.SearchArtistsByWord(word);
        }
        
        public int ArtistsLikes(string name)
        {
            DBservices dbs = new DBservices();
            return dbs.GetArtistLikes(name);
        }

        public List<string> TopArtistsByUsername(string username)
        {
            DBservices dbs = new DBservices();
            return dbs.GetTopArtistsByUser(username);
        }

        public static List<Artist> GetAllArtistsWithLikes()
        {
            DBservices dbs = new DBservices();
            return dbs.GetAllArtistsWithLikes();
        }
    }
}
