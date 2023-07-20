using Lyrics_Final_Proj.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lyrics_Final_Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtistsController : ControllerBase
    {
        // GET: api/<ArtistsController>
        [HttpGet]
        [Route("GetAllArtists")]
        public IEnumerable<string> ArtistsNames()
        {
            Artist artist = new Artist();
            return artist.ArtistsNames();
        }

        // GET: api/<ArtistsController>
        [HttpGet]
        [Route("TopArtistsByUsername/{username}")]
        public IEnumerable<string> TopArtistsNames(string username)
        {
            Artist artist = new Artist();
            return artist.TopArtistsByUsername(username);
        }

        // GET: api/<ArtistsController>
        [HttpGet]
        [Route("TopArtists")]
        public IEnumerable<Artist> TopArtistsNames()
        {
            Artist artist = new Artist();
            return artist.TopArtists();
        }

        // GET api/<ArtistsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // GET api/<ArtistsController>/5
        [HttpGet]
        [Route("ArtistsByWord/{word}")]
        public List<string> GetArtistsByWord(string word)
        {
            Artist artist =new Artist();
            return artist.GetArtistsWord(word);
        }

        // GET api/<ArtistsController>/5
        [HttpGet]
        [Route("ArtistsLikes/{name}")]
        public int GetArtistsLikes(string name)
        {
            Artist artist = new Artist();
            return artist.ArtistsLikes(name);
        }


        [HttpGet]
        [Route("GetAllArtistsWithLikes")]
        public List<Artist> GetArtistsLikes()
        {
            return Artist.GetAllArtistsWithLikes();
        }

        [HttpGet]
        [Route("GetIfUserLikedArtist/{email}/{artistName}")]
        public bool GetIfUserLikedArtist(string email, string artistName)
        {
            return Artist.GetIfUserLikedArtist(email,artistName);
        }

        [HttpGet]
        [Route("GetDeezerInfo/{artist}")]
        public Task<string> GetDeezerInfo(string artist)
        {
            return Artist.GetArtistInfo(artist);
        }

        // POST api/<ArtistsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // Adds/removes like from an artist 
        [HttpPost]
        [Route("AddRemoveLike/{mail}/{name}")]
        public int AddRemove(string mail, string name)
        {
            try
            {
                Artist artist = new Artist();
                return artist.AddRemoveLike(mail,name);
            }
            catch (Exception ex)
            {
                throw new Exception("User not found");
            }
        }

        // PUT api/<ArtistsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ArtistsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
