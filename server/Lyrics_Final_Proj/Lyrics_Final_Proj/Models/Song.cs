namespace Lyrics_Final_Proj.Models
{
    public class Song
    {
        public int Id { get; set; } 
        public string Title { get; set; }
        public string Lyrics { get ; set; }
        public string Link { get ; set; }
        public string ArtistName { get; set; }

        public int FavoriteCount { get; set; }
        public static List<Song> ReadAllSongs()
        {
            DBservices dbs = new DBservices();
            return dbs.ReadAllSongs();

        }

    }

}
