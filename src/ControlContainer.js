function Button(props) {
    return (
        <button onClick={props.onClick}>
            {props.text}
        </button>
    );
}

function ControlContainer(props) {
    let controlButton;
    if (props.gameInProgress){
        controlButton = <Button onClick={props.stopGame} text="RESIGN"/>
    } else {
        controlButton = <Button onClick={props.startGame} text="START GAME"/>
    }
    return (
        <div className='control'>
            {controlButton}
        </div>
    );
}

export default ControlContainer;