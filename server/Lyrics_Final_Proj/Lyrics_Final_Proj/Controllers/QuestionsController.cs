using Lyrics_Final_Proj.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Lyrics_Final_Proj.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionsController : ControllerBase
    {
        // GET: api/<ValuesController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<QuestionsController>/5
        [HttpGet]
        [Route("GetQuestionArtist")]
        public Question GetQByArtist()
        {
            Question question = new Question();
            question.makeQuestionByArtist();
            return question;
        }

        // GET api/<QuestionsController>/5
        [HttpGet]
        [Route("GetQuestionSong")]
        public Question GetQBySong()
        {
            Question question = new Question();
            question.makeQuestionBySong();
            return question;
        }

        // POST api/<QuestionsController>
        [HttpPost]
        [Route("CheckAnswerSongForArtist/{artist}/{song}")]
        public bool Post( string artist, string song)
        {
            return Question.checkQuestionByArtist(artist, song);

        }

        // PUT api/<QuestionsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<QuestionsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
