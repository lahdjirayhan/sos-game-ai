from flask import Flask

from application.configuration import Configuration

def create_app(config_object=Configuration):
    app = Flask(__name__, static_folder = '../build', static_url_path = '/')
    app.config.from_object(config_object)

    # Add neural network models
    # Already added in config_object as a throwaway hack/shortcut
    # TODO fix this; i.e. move the load_models function here

    # Register blueprints
    from application.api_routes import api
    from application.frontend_routes import frontend
    app.register_blueprint(api)
    app.register_blueprint(frontend)

    return app