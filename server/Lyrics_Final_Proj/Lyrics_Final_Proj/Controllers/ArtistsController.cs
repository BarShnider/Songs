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
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<ArtistsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
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
