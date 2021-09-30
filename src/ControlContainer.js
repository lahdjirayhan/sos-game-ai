import './ControlContainer.css'
import Button from './Utils.js'

function ModelDropdownSelect(props) {
    return (
        <select id='model-dropdown'
        className='model-dropdown'
        value={props.selectedValue}
        onChange={props.onChange}>
            <option value={null} disabled selected hidden>
                Please select a model
            </option>
            {props.modelList ? props.modelList.map(modelID => (
                <option value={modelID}>
                    {modelID}
                </option>
            )) : null}
        </select>
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
            <p> This is control container </p>
            
            <ModelDropdownSelect
                selectedValue={props.selectedValue}
                onChange={props.onChange}
                modelList={props.modelList}
            />

            {controlButton}
        </div>
    );
}

export default ControlContainer;