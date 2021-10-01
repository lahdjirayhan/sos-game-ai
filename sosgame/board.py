from typing import List, Literal, Tuple
import numpy as np
import torch as th
from sklearn.preprocessing import OneHotEncoder

def infer_legal_actions(features: th.Tensor) -> th.Tensor:
    """Given np representation of a board, give a Tensor of where legal actions are.
    
    This function is hack-ish but (I hope) it works to mask out illegal actions.
    """
    return (features.reshape(-1, 2).sum(dim=1) == 0).float()

class Board:
    def __init__(self, size: int = 5):
        self.size = size
        self.encoder = OneHotEncoder(handle_unknown = 'ignore', sparse = False).fit(np.array(["S", "O"]).reshape(-1, 1))
        self.reset()
    
    @property
    def is_full(self):
        return all([x != " " for x in self.tiles])
    
    @property
    def np_representation(self):
        return self.encoder.transform(np.array(self.tiles).reshape(-1, 1)).flatten()
    
    @property
    def cnn_representation(self):
        """Get board representation in channel-first format for CNN processing
        
        Naturally this has shape 2, 5, 5 [C * H * W]
        
        NOTE! This representation, when flattened, gives different result from np_representation.
        np_representation gives S0 O0 S1 ... O23 S24 O24, whereas this gives S0 S1 S2 ... O22 O23 O24"""
        return np.array([tile == mark for mark in list("SO") for tile in self.tiles]).astype('int').reshape(-1, self.size, self.size)
    
    @property
    def valid_actions(self):
        return np.array(self.tiles) == " "
    
    def render(self):
        return np.array(self.tiles).reshape(self.size, self.size)
    
    def reset(self):
        self.tiles: List[str] = [" " for _ in range(self.size**2)]
    
    def make_move(self, loc: int, marker: Literal["S", "O"]) -> Tuple[bool, int]:
        valid, sos_created = True, 0
        
        if self.tiles[loc] != " ":
            valid = False
        
        if valid:
            self.tiles[loc] = marker
            if marker == "S":
                indexes_to_check = self._get_indexes_to_check_S(loc)
            if marker == "O":
                indexes_to_check = self._get_indexes_to_check_O(loc)
            
            for combo in indexes_to_check:
                if tuple(self.tiles[i] for i in combo) == tuple("SOS"):
                    sos_created += 1
        
        return valid, sos_created
    
    def _get_indexes_to_check_S(self, loc: int) -> List[Tuple[int, int, int]]:
        result: List[Tuple[int, int, int]] = []
        SIZE = self.size
        ROW = loc // SIZE
        COL = loc % SIZE

        CHECK_E, CHECK_W, CHECK_N, CHECK_S = (
            COL < SIZE - 2, COL > 1, ROW > 1, ROW < SIZE - 2
        )
        
        if CHECK_E:
            result.append((loc, loc + 1, loc + 2))                          # EAST
            if CHECK_N:
                result.append((loc, loc + (1 - SIZE), loc + 2*(1 - SIZE)))      # NORTHEAST
            if CHECK_S:
                result.append((loc, loc + (1 + SIZE), loc + 2*(1 + SIZE)))      # SOUTHEAST

        if CHECK_W:        
            result.append((loc, loc - 1, loc - 2))                          # WEST
            if CHECK_N:
                result.append((loc, loc + (-1 - SIZE), loc + 2*(-1 - SIZE)))    # NORTHWEST
            if CHECK_S:
                result.append((loc, loc + (-1 + SIZE), loc + 2*(-1 + SIZE)))    # SOUTHWEST
        
        if CHECK_S:
            result.append((loc, loc + SIZE, loc + 2*SIZE))                  # SOUTH
        if CHECK_N:
            result.append((loc, loc - SIZE, loc - 2*SIZE))                  # NORTH

        result = [tpl for tpl in result if all([0 <= idx < SIZE**2 for idx in tpl])]
        return result
    
    def _get_indexes_to_check_O(self, loc: int):
        result: List[Tuple[int, int, int]] = []
        SIZE = self.size
        ROW = loc // SIZE
        COL = loc % SIZE

        CHECK_H, CHECK_V = (
            0 < COL < SIZE - 1, 0 < ROW < SIZE - 1
        )

        if CHECK_H:
            result.append((loc - 1, loc, loc + 1))                      # Horizontal
            if CHECK_V:
                result.append((loc + (-1 - SIZE), loc, loc + (1 + SIZE)))   # Diag /
                result.append((loc + (1 - SIZE), loc, loc + (-1 + SIZE)))   # Diag \
        
        if CHECK_V:
            result.append((loc - SIZE, loc, loc + SIZE))                # Vertical

        result = [tpl for tpl in result if all([0 <= idx < SIZE**2 for idx in tpl])]
        return result
