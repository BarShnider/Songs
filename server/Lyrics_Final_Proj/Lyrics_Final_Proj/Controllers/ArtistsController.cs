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
        [Route("TopArtists")]
        public IEnumerable<string> TopArtistsNames()
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

        // POST api/<ArtistsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // Adds/removes like from an artist 
        [HttpPost]
        [Route("Add/remove Like")]
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
