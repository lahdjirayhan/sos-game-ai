import './ControlContainer.css'
import Button from './Utils.js'

function ModelDropdownSelect(props) {
    return (
        <select id='model-dropdown'
        className='model-dropdown'
        value={props.selectedValue}
        onChange={props.onChange}>
            <option value={null} disabled selected hidden>
                Please select an enemy
            </option>
            {props.modelList ? props.modelList.map(modelID => (
                <option value={modelID}>
                    {modelID}
                </option>
            )) : null}
        </select>
    );
}

function FirstTurnDropdownSelect(props) {
    return (
    <select id='turn-dropdown'
    className='turn-dropdown'
    value={props.selectedValue}
    onChange={props.onChange}>
        <option value={"AI"}>
            AI moves first
        </option>
        <option value={"player"}>
            I move first
        </option>
    </select>
    )
}

function ControlContainer(props) {
    let controlButton;
    if (props.gameInProgress){
        controlButton = <Button onClick={props.stopGame} className='start-resign-button' text="RESIGN"/>
    } else {
        controlButton = <Button onClick={props.startGame} className='start-resign-button' text="START"/>
    }
    return (
        <div className='control'>
            <FirstTurnDropdownSelect 
                selectedValue={props.selectedValueTurn}
                onChange={props.onChangeTurn}
            />

            <ModelDropdownSelect
                selectedValue={props.selectedValueModel}
                onChange={props.onChangeModel}
                modelList={props.modelList}
            />

            {controlButton}
        </div>
    );
}

export default ControlContainer;