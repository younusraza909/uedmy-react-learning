import { useQuiz } from '../context/QuizContext';

function StartScreen({ numQuestions }) {
  const { startGame } = useQuiz();

  return (
    <div className='start'>
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button className='btn btn-ui' onClick={() => startGame()}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
