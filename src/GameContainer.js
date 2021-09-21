import './GameContainer.css'

function GameContainer(props) {
    let status;
    if (props.gameInProgress) {
        status = 'There is a game in progress here.'
    } else {
        status = 'There is NO game in progress here.'
    }
    return (
        <div className='game'>
            <p>This is game container.</p>

            <p>{status}</p>
        </div>
    );
}

export default GameContainer;