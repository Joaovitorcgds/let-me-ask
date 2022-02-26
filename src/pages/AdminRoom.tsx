import "../styles/room.scss"
import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"

import { useNavigate, useParams } from "react-router-dom"
import { database } from "../services/firebase"
import { useRoom } from "../hooks/useRoom"
// import { useAuth } from "../hooks/useAuth"

import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Questions } from "../components/Questions"


type RoomParams = {
  id: string;
}

export function AdminRoom(){
  // const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams() as RoomParams;
  const roomId = params.id;

  const {title, questions} = useRoom(roomId);
  
  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}/`).update({
      endedAt: new Date(),
    })
    navigate("/")
  }

  async function handleDeleteQuestion(questionId:string) {
    if (window.confirm("Tem certeza que deseja apagar esta pergunta")){
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handlecheckQuestionAsAnswer(questionId: string){
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    })
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`/rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    })
  }

  return(
    <div id="page-room">
      <header>
      <div className="content">
        <img src={logoImg} alt="Letmeask" />
        <div>
          <RoomCode code={roomId} />
          <Button isOutlined onClick={handleEndRoom}> Encerrar sala </Button>
        </div>
      </div>
    </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s) </span>}
        </div>

        {questions.map(question => {
          return(
            <Questions 
              key={question.id} 
              content={question.content} 
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
            >
              {!question.isAnswered && (
                <>
                  <button 
                    type="button"
                    onClick={() => handlecheckQuestionAsAnswer(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como repondida" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                  </button>
                </>
              )}
              <button 
                type="button"
                onClick={() => handleDeleteQuestion(question.id)}
              >
                <img src={deleteImg} alt="Deletar question" />
              </button>
            </Questions>
          )
        })}
      </main>
    </div>
  )
}