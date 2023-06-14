using Lyrics_Final_Proj.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lyrics_Final_Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SongsController : ControllerBase
    {
        // GET: api/<SongsController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [HttpGet]
        [Route("GetAllSongs")]
        public IEnumerable<Song> GetAllSongs()
        {
            return Song.ReadAllSongs();
        }

        [HttpGet]
        [Route("GetSongsByArtist/{artistName}")]
        public IEnumerable<Song> GetSongsByArtist(string artistName)
        {
            return Song.GetSongsByArtist(artistName);
        }

        [HttpGet]
        [Route("GetSongsBySongName/{songName}")]
        public IEnumerable<Song> GetSongs(string songName)
        {
            return Song.GetSongsBySongName(songName);
        }

        // GET api/<SongsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<SongsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<SongsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<SongsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
