
function signUp() {
    var username = $("#username").val();
    var password = $("#password").val();
    var confirm_password = $("#confirm_password").val();

    if (!username){
        alert("Please enter your username");
        return 0;
    }
    if (!password){
        alert("Please enter your password");
        return 0;
    }
    if (!confirm_password){
        alert("Please confirm your password");
        return 0;
    }
    if (confirm_password !== password){
        alert("Passwords don't match");
        return 0;
    }

    $.ajax({
        url:'/register',
        data: {username: username, password: password, confirm_password: confirm_password},
        type: 'POST',
        dataType: 'text',
        success: function(response){
            var json = JSON.parse(response);
            alert(json.success);
            window.location.href = '/create_bucket';

        },
        error: function (xhr){
            var json = JSON.parse(xhr.responseText);
            alert(json.error)
        }

    })


}

function login(){
    var username = $("#username").val();
    var password = $("#password").val();

    if(!username){
        alert("Please enter your username");
        return 0;
    }
    if(!password){
        alert("Please enter your password");
        return 0;
    }

    var data = {
        password:password,
        username:username
    };

    $.ajax({
        url: '/login',
        data: data,
        type: 'POST',
        success: function(){
            window.location.href = '/create_bucket';
        },
        error: function(xhr){
            var json = JSON.parse(xhr.responseText);
            alert(json.error);
            return 0;
        }
    })
}

