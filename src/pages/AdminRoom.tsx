import "../styles/room.scss"
import logoImg from "../assets/images/logo.svg"
import { Button } from "../components/Button"

import { FormEvent, useState } from "react"
import { useParams } from "react-router-dom"
import { RoomCode } from "../components/RoomCode"
import { useAuth } from "../hooks/useAuth"
import { database } from "../services/firebase"
import { Questions } from "../components/Questions"
import { useRoom } from "../hooks/useRoom"


type RoomParams = {
  id: string;
}

export function AdminRoom(){
  // const { user } = useAuth();
  const params = useParams() as RoomParams;
  const roomId = params.id;

  const {title, questions} = useRoom(roomId)


  return(
    <div id="page-room">
      <header>
      <div className="content">
        <img src={logoImg} alt="Letmeask" />
        <div>
          <RoomCode code={roomId} />
          <Button isOutlined> Encerrar sala </Button>
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
            <Questions key={question.id} content={question.content} author={question.author}/>
          )
        })}
      </main>
    </div>
  )
}