import numpy as np
from typing import Literal

from sosgame.custom_cnn import SOSGameCNN
from sosgame.environment import SOSGameEnv
from sosgame.custom_enemy import OneStepGreedyEnemy

from sb3_contrib import MaskablePPO
from sb3_contrib.common.wrappers.action_masker import ActionMasker
from sb3_contrib.common.maskable.policies import MaskableActorCriticCnnPolicy

def infer_action_mask(state: np.ndarray, representation: Literal['cnn', 'np'] = "cnn"):
    if representation == "cnn":
        action_mask = ~state.reshape(2, -1).sum(axis = 0).astype('bool') # type: ignore[operator]
    elif representation == "np":
        action_mask = ~state.reshape(-1, 2).sum(axis = 1).astype('bool') # type: ignore[operator]
    else:
        raise NotImplementedError

    action_mask = np.repeat(action_mask, 2)
    
    return action_mask

def make_model(path_to_saved_parameters):
    """Instantiate model, and load its parameters
    
    Instantiate a MaskablePPO model with (my own) standard settings,
    then load the parameters from path_to_saved_parameters.
    """
    policy_kwargs = dict(
        features_extractor_class = SOSGameCNN,
        normalize_images = False
    )
    dummy_env = SOSGameEnv(enemy=None)
    model = MaskablePPO(MaskableActorCriticCnnPolicy, dummy_env,
                        tensorboard_log = None,
                        policy_kwargs = policy_kwargs,
                        verbose = 0).load(path_to_saved_parameters)
    return model