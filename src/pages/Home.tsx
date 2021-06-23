//Packages
import { FormEvent, useState } from "react";
import { useHistory } from "react-router";

//Hooks
import { useAuth } from "../hooks/useAuth";

//Images
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";

//Styles
import "../styles/auth.scss";

//Components
import { Button } from "../components/Button";
import { database } from "../services/firebase";

export function Home() {
  const history = useHistory();
  const { user, signInWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState("");

  //Direciona para a página de criação de salas
  async function handleCreateRoom() {
    //Se o usuário não estiver autenticado
    if (!user) {
      //Faz o login com o Google
      await signInWithGoogle();
    }

    //Se estiver autenticado, redireciona para a página de criação de salas
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      return;
    }

    //Verifica se a sala que o usuário está tentando acessar existe
    //passando o id(key) da sala
    //.get() -> Puxa todos os registros da sala que o usuário acessou
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      alert("Essa sala não existe! Verifique se digitou o id corretamente");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire dúvidas da sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button className="create-room" onClick={handleCreateRoom}>
            <img src={googleIconImg} alt="Logo do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={(event) => handleJoinRoom(event)}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value)}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
