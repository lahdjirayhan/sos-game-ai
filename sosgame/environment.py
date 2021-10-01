import random
import gym
from gym import spaces
from typing import List, Optional, Union

import numpy as np
from .board import Board

class SOSGameEnv(gym.Env):
    AGENT_TURN = 0
    ENEMY_TURN = 1
    metadata = {'render.modes': ['console']}

    def __init__(self, board_size: int = 5, enemy = None, eval_scheme: bool = False):
        super().__init__()
        
        self.eval_scheme = eval_scheme
        
        self.action_space = spaces.Discrete(n = 2*(board_size**2))
        self.observation_space = spaces.Box(0, 1, (2, board_size, board_size), 'int')

        self.board = Board(board_size)
        self.enemy = enemy
        
        self.reset()
    
    def reset(self):
        self.board.reset()
        self.scores = [0, 0]
        self.AGENT_TURN = 0
        obs = self.board.cnn_representation

        if self.enemy is not None and random.choice([True, False]):
            obs, sos_created, done, info = self._execute_enemy_step()

        return obs
    
    def render(self, mode: str = 'console'):
        if mode != 'console':
            raise NotImplementedError
        pretty_render = self.board.render()
        print(pretty_render)
        print("Agent score:", self.scores[0])
        print("Enemy score:", self.scores[1])
    
    def step(self, action):
        if not self.action_space.contains(action):
            raise NotImplementedError
        
        obs, sos_created_player, done, info = self._step(action)
        
        if not info['valid']:
            return obs, -1_000_000, True, info

        self.scores[self.AGENT_TURN] += sos_created_player
        player_step_again = sos_created_player > 0

        sos_created_enemy = 0
        if not done and not player_step_again:
            if self.enemy is not None:
                enemy_step_again = True
                while enemy_step_again and not done:
                    obs, sos_created, done, info = self._execute_enemy_step()
                    sos_created_enemy += sos_created
                    enemy_step_again = sos_created > 0
        
        reward = 0
        if self.eval_scheme:
          score_advantage = self.scores[self.AGENT_TURN] - self.scores[self.ENEMY_TURN]
          if done:
              if score_advantage > 0:
                  reward = 1
              elif score_advantage < 0:
                  reward = -1
        else:
          reward = sos_created_player - sos_created_enemy
        
        return obs, reward, done, info
    
    def set_enemy(self, enemy):
        self.enemy = enemy

    def _step(self, action):
        loc, marker_index = divmod(action, 2)
        marker = list("SO")[marker_index]
        valid, sos_created = self.board.make_move(loc, marker)
        done = self.board.is_full
        
        return self.board.cnn_representation, sos_created, done, {"valid": valid}

    def _execute_enemy_step(self):
        if self.enemy == 'human':
            self.render(mode = 'console')
            while True:
                try:
                    loc = int(input("Enter tile index:"))
                    if not (0 <= loc < self.board.size**2): continue
                    marker = int(input("Enter marker type:"))
                    if not (0 <= marker <= 1): continue
                except ValueError:
                    continue
                break
            action = 2*loc + marker
        elif self.enemy == 'random':
            action = random.choice(np.argwhere(self.action_mask == 1).flatten().tolist())
        else:
            action, _state = self.enemy.predict(self.board.cnn_representation, action_masks = self.action_mask)
        obs, sos_created, done, info = self._step(action)
        
        self.scores[self.ENEMY_TURN] += sos_created

        return obs, sos_created, done, info
    
    @property
    def action_mask(self):
        return np.repeat(self.board.valid_actions, 2).astype('int')