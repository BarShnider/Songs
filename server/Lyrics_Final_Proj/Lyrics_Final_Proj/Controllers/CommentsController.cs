using Lyrics_Final_Proj.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lyrics_Final_Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        // GET: api/<CommentsController>
        [HttpGet]
        [Route("GetAllCommentsArtists/{artistName}")]
        public IEnumerable<Comment> GetCommentsToArtist(string artistName)
        {
            Comment comment = new Comment();
            return comment.CommentsByArtist(artistName);
        }

        // GET api/<CommentsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CommentsController>
        [HttpPost]
        [Route("CommentToArtist")]
        public int PostCommentToArtist(Comment comment)
        {
            return comment.AddCommentArtist();
        }

        // POST api/<CommentsController>
        [HttpPost]
        [Route("CommentToSong")]
        public int PostCommentToSong(Comment comment)
        {
            return comment.AddCommentArtist();
        }

        // PUT api/<CommentsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CommentsController>/5
        [HttpDelete()]
        [Route("DeleteSongByID/{idA}")]
        public int DeleteCommentArtist(int idA)
        {
            Comment comment = new Comment();
            return comment.DeleteCommentA(idA);
        }

        // DELETE api/<CommentsController>/5
        [HttpDelete("{idS}")]
        public int DeleteCommentSong(int idS)
        {
            Comment comment = new Comment();
            return comment.DeleteCommentS(idS);
        }
    }
}
