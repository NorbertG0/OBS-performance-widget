from flask import Flask
from api.routes import api
from monitor import start_monitor

app = Flask(__name__)

app.register_blueprint(api)

start_monitor()


if __name__ == "__main__":
    app.run()