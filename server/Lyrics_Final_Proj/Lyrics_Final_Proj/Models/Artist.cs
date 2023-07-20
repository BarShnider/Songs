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

        public List<Artist> TopArtists()
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

        public static bool GetIfUserLikedArtist(string email, string artistName)
        {
            DBservices dbs = new DBservices();
            return dbs.GetIfUserLikedArtist(email,artistName);
        }

        public static async Task<string> GetArtistInfo(string artistName)
        {
            //string artistName = "Queen";
            string apiUrl = $"https://api.deezer.com/search?q={artistName}";

            try
            {
                using (HttpClient httpClient = new HttpClient())
                {
                    // Make a GET request to the Deezer API
                    HttpResponseMessage response = await httpClient.GetAsync(apiUrl);

                    // Check if the request was successful
                    if (response.IsSuccessStatusCode)
                    {
                        // Read the response content as a string
                        string responseBody = await response.Content.ReadAsStringAsync();

                        // Process the response data (you can use JSON deserialization if needed)
                        Console.WriteLine(responseBody);
                        return responseBody;
                    }
                    else
                    {
                        // Handle the case when the request fails
                        Console.WriteLine($"Request failed with status code: {response.StatusCode}");
                        return null;
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle any exceptions that might occur during the request
                Console.WriteLine($"An error occurred: {ex.Message}");
                return null;
            }
        }
    }
}
