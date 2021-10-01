import random
import numpy as np
from copy import deepcopy
from sosgame.board import Board

class HelperBoard(Board):

    def _convert_cnn_repr_into_tiles_list(self, state: np.ndarray):
        tiles_size = int(state[0].flatten().shape[0])
        tiles = [" " for _ in range(tiles_size)]

        S = state[0].flatten()
        O = state[1].flatten()

        for i in range(len(tiles)):
            if S[i]:
                tiles[i] = "S"
            
            if O[i]:
                tiles[i] = "O"
        
        self.tiles = tiles

class OneStepGreedyEnemy:
    def __init__(self):
        self.helper_board = HelperBoard()
    
    def predict(self, state: np.ndarray, *args, **kwargs):
        # Return action where loc, marker = divmod(action, 2)
        # state is CNN-representation format
        self.helper_board._convert_cnn_repr_into_tiles_list(state)
        
        valid_actions = np.repeat(self.helper_board.valid_actions, 2)
        action_value = [0.0 for _ in valid_actions]

        for action, valid in enumerate(valid_actions):
            if not valid:
                action_value[action] = -100_000
                continue
            
            _helper_board = deepcopy(self.helper_board)
            loc, marker_index = divmod(action, 2)
            marker = list("SO")[marker_index]
            _valid, sos_created = _helper_board.make_move(loc, marker)

            if sos_created:
                action_value[action] = sos_created
                continue

            miss_one_patterns = [tuple(ptn) for ptn in ["SO ", " OS", "S S"]]
            if marker == "S":
                indices_to_check = _helper_board._get_indexes_to_check_S(loc)
            elif marker == "O":
                indices_to_check = _helper_board._get_indexes_to_check_O(loc)
            
            miss_one_created = 0
            for combo in indices_to_check:
                for pattern in miss_one_patterns:
                    if tuple(_helper_board.tiles[i] for i in combo) == pattern:
                        miss_one_created += 1

            action_value[action] = -miss_one_created
        
        action_value_arr = np.array(action_value)
        action_max_value: int = random.choice(np.argwhere(action_value_arr == action_value_arr.max()).flatten().tolist())
        return action_max_value, None