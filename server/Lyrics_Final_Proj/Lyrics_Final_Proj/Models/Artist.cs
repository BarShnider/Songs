﻿namespace Lyrics_Final_Proj.Models
{
    public class Artist
    {
        public string Name { get; set; }
        public int FavoriteCount {get;set; }

        public int AddRemoveLike(string name, int num)
        {
            DBservices dBservices = new DBservices();
            return dBservices.AddRemoveLike(name, num);

        }

    }
}
