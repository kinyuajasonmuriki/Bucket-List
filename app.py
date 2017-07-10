from datetime import date

from flask import request, render_template, Flask, jsonify, make_response, redirect, url_for, session

from os import path

import shelve


app = Flask(__name__)

SHELVE_DB = 'bucket_list_db'

app.config.from_object(__name__)

db = shelve.open(path.join(app.root_path, app.config['SHELVE_DB']), writeback=True)

app.secret_key = 'this is a secret'


def create_data(*args, **kwargs ):
    data = AbstractFeatures(*args, **kwargs)
    return data.create_data_()


def read_data(*args, **kwargs):
    data = AbstractFeatures(*args, **kwargs)
    return data.read_data_()


def update_data(*args, **kwargs):
    data = AbstractFeatures(*args, **kwargs)
    return data.update_data_()


@app.route('/', methods=['GET'])
def home():
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('registration/register.html')

    if request.method == 'POST':
        data = request.form.to_dict()
        username = data.get('username')
        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if not username:
            return make_response(jsonify({'error': 'Please enter your username'}), 500)

        if not password:
            return make_response(jsonify({'error': 'Please enter your password'}), 500)

        if password != confirm_password:
            return make_response(jsonify({'error': 'Passwords do not match'}), 500)

        if username in db.keys():
            return make_response(jsonify({'error': 'User already exists with that username'}), 500)

        db[username] = password
        session['user'] = username
        return jsonify({'success': 'Account created successfully'})


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template('registration/login.html')

    if request.method == 'POST':
        data = request.form.to_dict()
        username = data.get('username')
        password = data.get('password')

        if username not in db.keys():
            return make_response(jsonify({'error': 'Username not found. Please sign up to continue'}), 500)

        for key, value in db.items():
            if key == username:
                if value == password:
                    session['user'] = username
                    return jsonify({'success': 'Authenticated successfully'})
                else:
                    return make_response(jsonify({'error': 'Incorrect password'}), 500)

            else:
                return make_response(jsonify({'error': 'Username not found. Please sign up to continue'}), 500)


@app.route('/logout', methods=['GET', 'POST'])
def logout():
    session.pop('user', None)
    return redirect(url_for('login'))


@app.route('/create_bucket', methods=['GET', 'POST'])
def create_bucket():
    if request.method == 'GET':
        if 'user' in session.keys() and 'user' in session.keys() is not None:
            return render_template('create_bucket.html', page='Create Bucket')
        else:
            return redirect({url_for('login')})

    if request.method == 'POST':
        username = session.get('user')
        data = request.form.to_dict()
        bucket_name = data.get('bucket_name')
        description = data.get('description')
        data = dict(bucket=True, username=username, bucket_name=bucket_name, description=description)
        response = create_data(**data)

        if response.message:
            return make_response(jsonify({'success': 'Bucket Created successfully'}))


@app.route('/view_buckets')
def view_buckets():
    if request.method == 'GET':
        if 'user' in session.keys():
            details = read_data(username=session.get('user'), bucket=True)
            new_details = {}
            for i, d in enumerate(details):
                new_details[i] = d
            return render_template('view_bucket.html', details=new_details, page='View Buckets')
        else:
            return redirect(url_for('login'))


@app.route('/delete_bucket')
def delete_bucket():
    return


@app.route('/add_item')
def add_item():
    if request.method == 'GET':
        item = request.args.get('item_name')
    return


@app.route('/view_items')
def view_item():
    return


@app.route('/update_item')
def update_item():
    return


@app.route('/delete_item')
def delete_item():
    return


@app.route('/view_activities')
def view_activities():
    return


@app.route('/add_activities')
def add_activities():
    return render_template('add_activities.html')


class AbstractFeatures(object):
    def __init__(self, *args, **kwargs):
        self.details = kwargs
        self.args = args
        self.message = None
        self.error_message = None
        self.username = None
        self.bucket_name = None
        self.description = None
        self.bucket = False
        self.activity = False
        self.filtered = None
        self.initialize()

    def initialize(self):
        map(lambda x: self.details.update(dict(x, )), self.args)
        for key, value in self.details.items():
            setattr(self, key, value)

    def create_data_(self):
        def add_bucket():

            values = dict(user=self.username, bucket_name=self.bucket_name, description=self.description,
                          created=date.today())

            if 'buckets' in db.keys():
                db['buckets'].append(values)
            else:
                db['buckets'] = [values]
            self.message = 'Data created successfully'
            return self

        def add_activity():
            return self

        if self.bucket:
            return add_bucket()

        elif self.activity:
            return add_activity()

    def read_data_(self):
        try:
            self.filtered = [item for item in db['buckets'] if item['user'] == self.username]
            return self.filtered

        except KeyError:
            return False

    def update_data_(self):
        pass

    def delete_data_(self):
        pass


if __name__ == '__main__':
    app.run()
