namespace Lyrics_Final_Proj.Models
{
    public class Comment
    {
        public string Email { get; set; }
        public string Content { get; set; }
        public string Whom { get; set; }
        public DateTime date { get; set; }

        public int AddCommentArtist()
        {
            DBservices dbs = new DBservices();
            return dbs.AddCommentArtist(this);
        }
        public int AddCommentSong()
        {
            DBservices dbs = new DBservices();
            return dbs.AddCommentSong(this);
        }
        public int DeleteCommentA(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteCommentArtist(id);
        }
        public int DeleteCommentS(int id)
        {
            DBservices dbs = new DBservices();
            return dbs.DeleteCommentSong(id);
        }

        public List<Comment> CommentsByArtist(string artistName)
        {
            DBservices dbs = new DBservices();
            return dbs.ReturnCommentsToArtist(artistName);
        }
        public List<Comment> CommentsBySong(string song)
        {
            DBservices dbs = new DBservices();
            return dbs.ReturnCommentsToSong(song);
        }
        

    }
}
