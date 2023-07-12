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

    }
}
