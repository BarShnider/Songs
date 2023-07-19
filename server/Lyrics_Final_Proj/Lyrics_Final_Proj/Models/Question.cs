namespace Lyrics_Final_Proj.Models
{
    public class Question
    {
        public string ContentQ { get; set; }
        public string AnswerA { get; set; }
        public string AnswerB { get; set; }
        public string AnswerC { get; set; }
        public string AnswerD { get; set; }

        public void makeQuestionByArtist()
        {
            Question question = new Question();
            DBservices dbs = new DBservices();
            List<string> Q=dbs.QandA();
            List<string> A = dbs.ThreeAnswers(Q[0]);
            Q.Add(A[0]);
            Q.Add(A[1]);
            Q.Add(A[2]);
            Random random = new Random();
            int randomNumber = random.Next(1, 5);
            if (randomNumber != 1)
            {
                string temp = Q[1];
                Q[1] = Q[randomNumber];
                Q[randomNumber] = temp;
            }
            this.ContentQ = Q[0];
            this.AnswerA = Q[1]; //0
            this.AnswerB = Q[2]; //1
            this.AnswerC = Q[3]; //2
            this.AnswerD = Q[4]; //3
        }
        public void makeQuestionBySong()
        {
            Question question = new Question();
            DBservices dbs = new DBservices();
            List<string> Q = dbs.QandA();
            string temp = Q[0];
            Q[0] = Q[1];//Q[0] = song
            Q[1] = temp;//Q[1] = artist
            List<string> A = dbs.ThreeAnswersSong(Q[1],Q[0]);
            Q.Add(A[0]);
            Q.Add(A[1]);
            Q.Add(A[2]);
            Random random = new Random();
            int randomNumber = random.Next(1, 5);
            if (randomNumber != 1)
            {
                temp = Q[1];
                Q[1] = Q[randomNumber];
                Q[randomNumber] = temp;
            }
            this.ContentQ = Q[0];
            this.AnswerA = Q[1]; 
            this.AnswerB = Q[2]; 
            this.AnswerC = Q[3]; 
            this.AnswerD = Q[4]; 
        }
    }
}
