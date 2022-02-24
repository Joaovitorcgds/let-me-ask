import "../styles/room.scss"
import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import { Button } from "../components/Button"


import { useNavigate, useParams } from "react-router-dom"
import { RoomCode } from "../components/RoomCode"
// import { useAuth } from "../hooks/useAuth"
import { Questions } from "../components/Questions"
import { useRoom } from "../hooks/useRoom"
import { database } from "../services/firebase"


type RoomParams = {
  id: string;
}

export function AdminRoom(){
  // const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams() as RoomParams;
  const roomId = params.id;

  const {title, questions} = useRoom(roomId);

  async function handleDeleteQuestion(questionId:string) {
    if (window.confirm("Tem certeza que deseja apagar esta pergunta")){
      await database.ref(`/rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}/`).update({
      endedAt: new Date(),
    })
    navigate("/")
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
            <Questions key={question.id} content={question.content} author={question.author}>
              <button 
              type="button"
              onClick={() => handleDeleteQuestion(question.id)}>
                <img src={deleteImg} alt="deletar question" />
              </button>
            </Questions>
          )
        })}
      </main>
    </div>
  )
}