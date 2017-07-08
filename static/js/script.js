/**
 * Created by ridge on 6/24/17.
 */
$.ajaxLoad = true;

$.defaultPage = 'templates/core/dashboard.html';

$.mainContent = $("#ui-view");



$(function () {
    $('#sign_up').validate({
        rules: {
            'terms': {
                required: true
            },
            'confirm_password': {
                equalTo: '[name="password"]'
            }
        },
        highlight: function (input) {
            console.log(input);
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
            $(element).parents('.form-group').append(error);
        }
    });
});

$(function () {
    $('#sign_in').validate({
        highlight: function (input) {
            console.log(input);
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.input-group').append(error);
        }
    });
});

function login(){
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    var username = $('input[name="username"]').val();
    var password = $('input[name="password"]').val();
    var redirect_url = $('input[name="redirect_url"]').val();

    if (!password || !username){
        return 0;
    }

    $.ajax({
        url: '/merchant/login/',
        data: {username:username, password:password, redirect_url:redirect_url},
        dataType: 'text',
        type: 'POST',
        beforeSend: function (xmlHTTPRequest) {
            xmlHTTPRequest.setRequestHeader('X-CSRFToken', token);
        },
        success: function(response){
            var json = JSON.parse(response);
            window.location.href = json.url;
        },
        error: function(xhr){
            var json = JSON.parse(xhr.responseText);
            if (json.error === 'username'){
                swal('Error!', 'Username does not exist', 'error');
                return 0;
            }
            else if (json.error === 'password'){
                swal('Error!', 'Incorrect Password', 'error');
                return 0;
            }


        }
    })
}

function signUp(){
    var token = $('input[name="csrfmiddlewaretoken"]').val();
    var username = $('input[name="username"]').val();
    var full_name = $('input[name="full_name"]').val();
    var phone = $('input[name="phone"]').val();
    var email = $('input[name="email"]').val();
    var password = $('input[name="password"]').val();
    var confirm_password = $('input[name="confirm_password"]').val();

    if (!(confirm_password === password)){
        return 0;
    }
    if (!username ||!full_name || !phone ||!password ||!confirm_password){
        return 0;
    }
    var post_data = {
        username:username,
        full_name:full_name,
        phone:phone,
        email:email,
        password:password,
        confirm_password:confirm_password
    };

    $.ajax({
        url: '/merchant/register/',
        data: post_data,
        dataType: 'text',
        type: 'POST',
        beforeSend: function (xmlHTTPRequest) {
            xmlHTTPRequest.setRequestHeader('X-CSRFToken', token);
        },
        success: function (response) {
            var json = JSON.parse(response);
            window.location.href = json.url;

        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            swal('Error!', json.error, 'error');
        }
    })
}

function saveShopWizardForm() {
    var shop_name = $("#shop_name").val();
    var shop_phone = $("#shop_phone").val();
    var shop_email = $("#shop_email").val();
    var location = $("#location").val();
    var company_name = $("#company_name").val();
    var reg_no = $("#registration_number").val();
    var business_website = $("#business_website").val();
    var main_contact = $("#address").val();
    var cash = $("#cash").checked;
    var mpesa = $("#m-pesa").checked;
    var airtel = $("#airtel-money").checked;
    var equitel = $("#equitel").checked;
    var visa = $("#visa-card").checked;
    var master = $("#master-card").checked;
    var csrf_token = $("input[name='csrfmiddlewaretoken']").val();
    var alt_phone = $("#shop_alt_phone").val();

    if (!shop_name){
        swal('Error!', 'Please enter the shop name', 'error');
        return 0;
    }

    if (!shop_phone){
        swal('Error!', 'Please enter the shop phone', 'error');
        return 0;
    }

    if (!location){
        swal('Error!', 'Please enter the location', 'error');
        return 0;
    }

    if (!csrf_token){
        swal('Warning!', 'Please refresh the page and re-enter details', 'warning');
        return 0;
    }
    var data = {
        shop_name:shop_name,
        shop_email:shop_email,
        shop_phone:shop_phone,
        location:location,
        company_name:company_name,
        reg_no:reg_no,
        business_website:business_website,
        main_contact:main_contact,
        cash:cash,
        mpesa:mpesa,
        airtel:airtel,
        visa:visa,
        master:master,
        alt_phone:alt_phone
    };

    $.ajax({
        url: '/merchant/shop-setup/',
        data: data,
        dataType: 'text',
        type: 'POST',
        beforeSend: function (xmlHTTPRequest) {
            xmlHTTPRequest.setRequestHeader('X-CSRFToken', csrf_token);
        },
        success: function (response) {
            var json = JSON.parse(response);
            swal({
                title: 'Success!',
                text: 'You will be contacted by Price Poa Agents to confirm. Meanwhile you can add products',
                type: 'success',
                timer: 2000
            });
            window.location.href = json.url;
        },
        error: function (xhr) {
            var json = JSON.parse(xhr.responseText);
            swal('Error!', json.error, 'error');
            return 0;
        }
    });

}