import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const apiURL = process.env.API_URL || 'http://localhost:8080';

export function NewGame() {
  const [games, setGames] = useState([]);

  const history = useHistory();
  const joinClick = (event) => {
    console.log(event.target.getAttribute('index'));
  };

  //const playGame = (gameID) => {};

  const newGameClick = () => {
    axios
      .get(apiURL + '/api/create_game', { withCredentials: true })
      .then((response) => {
        history.push('setup/' + response.data.gameID);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    axios
      .get(apiURL + '/api/getGames', { withCredentials: true })
      .then((response) => {
        setGames(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderRows = () => {
    return games.map((item) => {
      return (
        <tr key={item.gameID}>
          <td>{item.gameID}</td>
          <td>{item.player1}</td>
          <td>
            <button className="btn-primary" index={item.gameID} onClick={joinClick}>
              Join
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <table className="table-primary table-bordered">
        <tbody>
          <tr>
            <th>Game ID</th>
            <th>Player ID</th>
            <th>Join</th>
          </tr>
          {renderRows()}
        </tbody>
      </table>
      <div className="my-5">
        <h5>Or Create A New Game</h5>
        <button className="btn-success" onClick={newGameClick}>
          New Game
        </button>
      </div>
    </div>
  );
}
