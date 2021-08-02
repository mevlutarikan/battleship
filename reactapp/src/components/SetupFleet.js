import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const apiURL = process.env.API_URL || 'http://localhost:8080';

export function SetupFleet(props) {
  const [ships, setShips] = useState([]);
  const [grid, setGrid] = useState();
  const [msj, setMsj] = useState('');
  const [shipTable, setShipTable] = useState([]);

  const gridClick = (event) => {
    console.log(event);
  };

  const createGrid = (lRow, lCol) => {
    let rows = '';
    let cols = '';
    for (let j = 0; j <= lCol; j++) {
      cols += <td onClick={gridClick}></td>;
    }
    for (let i = 0; i <= lRow; i++) {
      rows += <tr>{cols}</tr>;
    }
    setGrid(<table>{rows}</table>);
  };

  const setClick = (event) => {};
  const startClick = (event) => {};

  useEffect(() => {
    axios
      .get(apiURL + '/api/getgrid')
      .then((response) => {
        setShips(response.data.fleet.ships);

        createGrid(response.data.lastRow, response.data.lastColumn);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const renderTable = () => {
    setShipTable(
      <table className="table-primary ">
        <tr>
          <th>Ship ID</th>
          <th>Player Name</th>
          <th>Lenght</th>
          <th>Row</th>
          <th>Column</th>
          <th>Set</th>
        </tr>
        {ships.map((item) => {
          return (
            <tr key={item.shipID}>
              <td>{item.name}</td>
              <td>{item.lenght}</td>
              <td>
                <input type="number" name="row" index={item.shipID} />
              </td>
              <td>
                <input type="number" name="col" index={item.shipID} />
              </td>
              <td>
                <button className="btn-primary" index={item.shipID} onClick={setClick}>
                  Set
                </button>
              </td>
            </tr>
          );
        })}
      </table>
    );
  };

  return (
    <div>
      <div className="alert alert-danger" role="alert">
        {msj}
      </div>
      {shipTable}
      <div className="my-5">
        <button className="btn-success" onClick={startClick}>
          Start
        </button>
      </div>
      {grid}
    </div>
  );
}
