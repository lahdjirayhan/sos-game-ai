# List of possible HTTP methods
# 
# Method        URI                 To do what?
# GET           /api/models         List all available NN models (for enemy selection)
# POST          /api/predict        Send board state and get predicted enemy action as response
# 
# API fields definitions
# Model
# name      : model name
# 
# Board state
# state     : board state, in the form of 50-length array describing the board
#               (cnn-representation format)
# model_id  : id of the model to predict
# 
# Prediction
# model_id  : id of the model that gives the prediction
# action    : predicted action, in integer format [0, 49]
#

from flask import Blueprint, request, abort, current_app
import numpy as np
from application.sosgame_utils import infer_action_mask

api = Blueprint("api", __name__)

@api.route("/api/predict", methods = ["POST"])
def predict():
    # Check for bad request
    if not request.json:
        current_app.logger.error("Bad request: no JSON is detected")
        abort(400)
    
    # Get request data
    try:
        state = request.json['state']
        model_id = request.json['model_id']
    except KeyError:
        current_app.logger.error("Bad request: JSON is incomplete")
        abort(400)
    
    # Get model
    try:
        model = current_app.config["MODELS"][model_id]
    except KeyError:
        current_app.logger.error("Bad request: model id is wrongly specified")
        abort(400)
    
    # Check model and state dimensions
    # TODO FIXME

    # Get prediction
    state = np.array(state)
    cnn_state = state.reshape(-1, 5, 5) # 5 is hardcoded size; don't forget to FIXME when needed
    action, _ = model.predict(cnn_state, action_masks = infer_action_mask(state))

    return dict(
        model_id = model_id,

        # To avoid np 'not JSON serializable' error https://stackoverflow.com/a/50916741/11316205
        action = int(action)
    )

@api.route("/api/list")
def list_models():
    return dict(
        model_ids = [path for path in current_app.config['MODELS']]
    )