/**
 * Created by kimani on 6/29/17.
 */
$(function () {
    var form = $('#wizard_with_validation').show();
    form.steps({
        headerTag: 'h3',
        bodyTag: 'fieldset',
        transitionEffect: 'slideLeft',
        onInit: function (event, currentIndex) {
            $.AdminBSB.input.activate();

            //Set tab width
            var $tab = $(event.currentTarget).find('ul[role="tablist"] li');
            var tabCount = $tab.length;
            $tab.css('width', (100 / tabCount) + '%');

            //set button waves effect
            setButtonWavesEffect(event);
        },
        onStepChanging: function (event, currentIndex, newIndex) {
            if (currentIndex > newIndex) { return true; }

            if (currentIndex < newIndex) {
                form.find('.body:eq(' + newIndex + ') label.error').remove();
                form.find('.body:eq(' + newIndex + ') .error').removeClass('error');
            }

            form.validate().settings.ignore = ':disabled,:hidden';
            return form.valid();
        },
        onStepChanged: function (event, currentIndex, priorIndex) {
            setButtonWavesEffect(event);
        },
        onFinishing: function (event, currentIndex) {
            form.validate().settings.ignore = ':disabled';
            return form.valid();
        },
        onFinished: function (event, currentIndex) {
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

            if (!shop_name || !shop_phone || !location || !reg_no || !main_contact){
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
                url: 'merchant/shop-setup/',
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
    });

    form.validate({
        highlight: function (input) {
            $(input).parents('.form-line').addClass('error');
        },
        unhighlight: function (input) {
            $(input).parents('.form-line').removeClass('error');
        },
        errorPlacement: function (error, element) {
            $(element).parents('.form-group').append(error);
        }
    });
});

function setButtonWavesEffect(event) {
    $(event.currentTarget).find('[role="menu"] li a').removeClass('waves-effect');
    $(event.currentTarget).find('[role="menu"] li:not(.disabled) a').addClass('waves-effect');
}