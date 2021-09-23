import './ControlContainer.css'

function Button(props) {
    return (
        <button onClick={props.onClick} className={props.className}>
            {props.text}
        </button>
    );
}

function ControlContainer(props) {
    let controlButton;
    if (props.gameInProgress){
        controlButton = <Button onClick={props.stopGame} className='start-resign-button' text="RESIGN"/>
    } else {
        controlButton = <Button onClick={props.startGame} className='start-resign-button' text="START GAME"/>
    }
    return (
        <div className='control'>
            {controlButton}
        </div>
    );
}

export default ControlContainer;