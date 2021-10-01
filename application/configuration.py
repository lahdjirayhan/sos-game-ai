from pathlib import Path
from typing import Any, List

from application.sosgame_utils import make_model, OneStepGreedyEnemy

# Workaround to enable ANSI color styling in Git Bash in Windows
# https://github.com/pallets/werkzeug/issues/1832
# Does not work, but I'll leave it here
# import os, sys
# if sys.platform.lower() == "win32": os.system("color")

def load_all_sb3_models():
    def get_name_plus_parents_name(path: Path):
        return path.parent.name + "/" + path.name

    paths_to_models: List[Path] = []
    MODEL_FOLDER_PATH = Path(__file__).resolve().parent / 'models'
    for MODEL_FOLDER in MODEL_FOLDER_PATH.iterdir():
        for file in MODEL_FOLDER.iterdir():
            if file.suffix == ".zip":
                paths_to_models.append(file)
    
    models = {
        get_name_plus_parents_name(path): make_model(path) for path in paths_to_models
    }

    return models

def make_custom_models():
    return dict(one_step_greedy_enemy=OneStepGreedyEnemy())

def load_models():
    sb3_models = load_all_sb3_models()
    custom_handmade_models = make_custom_models()

    return {**sb3_models, **custom_handmade_models}
    
class Configuration:
    MODELS = load_models()