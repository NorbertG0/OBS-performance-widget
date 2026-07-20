from flask import Flask
from api.routes import api
from web.routes import web
from monitor import start_monitor

app = Flask(
    __name__,
    static_folder="web/static",
    template_folder="web/templates"
    )

app.register_blueprint(api)
app.register_blueprint(web)

start_monitor()


if __name__ == "__main__":
    app.run()