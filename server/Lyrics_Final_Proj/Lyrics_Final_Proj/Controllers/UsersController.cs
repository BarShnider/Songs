using Lyrics_Final_Proj.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lyrics_Final_Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        // GET: api/<UsersController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<UsersController>/5
        [HttpGet("{Email}")]
        public string Get(string Email)
        {
            return "value";
        }

        // Check if user exists
        [HttpPost]
        [Route("Login")]
        public int Login(User user)
        {
            try
            {
                return user.Login();
            }
            catch (Exception ex)
            {
                throw new Exception("User not found");
            }
        }

        [HttpPost]
        [Route("Register")]
        public bool Register([FromBody] User user)
        {
            return user.Register();
        }

        // POST api/<UsersController>
        [HttpPost]
        [Route("UserLikesSong")]
        public bool Post(string email, string songName)
        {
            User user = new User();
            return user.AddSongToFav(email, songName);

        }

        // PUT api/<UsersController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<UsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
