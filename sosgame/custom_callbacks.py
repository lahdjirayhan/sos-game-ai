import os
from copy import deepcopy
from sosgame.environment import SOSGameEnv
from stable_baselines3.common.callbacks import EventCallback

class SetNewEnemyCallback(EventCallback):
    def __init__(self, *args, enemy_save_path = None, enemy_class, enemy_class_kwargs, **kwargs):
        super().__init__(*args, **kwargs)
        self.enemy_save_path = enemy_save_path
        self.enemy_class = enemy_class
        self.enemy_class_kwargs = enemy_class_kwargs

        self.i_ = 1
    
    def _init_callback(self) -> None:
        if self.enemy_save_path is not None:
            os.makedirs(self.enemy_save_path, exist_ok=True)
    
    def _on_step(self) -> bool:
        # Disregard if (Maskable)EvalCallback parent has
        # little best_mean_reward value. This hack makes
        # this callback disregards first-time evals
        # that results in bad models.
        if self.parent.best_mean_reward < 0.5:
            return True
        
        if self.enemy_save_path is not None:
            # Set path
            savepath = os.path.join(self.enemy_save_path, "enemy_" + str(self.i_))
            self.i_ += 1
            
            # Save model
            self.model.save(savepath)

            # Create new model to be the new enemy
            new_enemy = self.enemy_class(**self.enemy_class_kwargs)
            new_enemy.load(savepath)

            # Replace model's environment(s) with envs patched new enemies
            self.model.env.env_method(
                'set_enemy',
                new_enemy,
                indices=range(self.model.env.num_envs)
            )

            # Replace eval environment(s) with envs patched new enemies
            self.parent.eval_env.env_method(
                'set_enemy',
                new_enemy,
                indices=range(self.parent.eval_env.num_envs)
            )

            if self.verbose > 0:
                print("Enemy has been updated.")
                print("New enemy:", new_enemy)
                for i in range(self.model.env.num_envs):
                    print("Enemy in training environment", i, ":", self.model.env.get_attr('enemy', indices = i))
                for i in range(self.parent.eval_env.num_envs):
                    print("Enemy in eval environment", i, ":", self.parent.eval_env.get_attr('enemy', indices = i))
        return True
