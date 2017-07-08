from flask import Flask
from flask import render_template


app = Flask(__name__)


def hello_world():
    return 'Hello World!'


@app.route('/register', methods=['GET', 'POST'])
def register():
    return render_template('registration/register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    return render_template('registration/login.html')


if __name__ == '__main__':
    app.run()
