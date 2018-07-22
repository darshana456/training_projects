$(document).ready(function() {
  $("form[name = 'registration']").validate({
    ignore: 'hidden',
    rules: {
      file: {
        required: true,
      },
      name: {
        required: true,
        validateName: true,
      },
      email: {
        required: true,
        email: true,
        validateEmail: true,
      },
      age: {
        required: true,
        range: [18, 32],
      },
      color: {
        required: true,
      },
      date: {
        required: true,
        validateDate: true,
      },
      mobile: {
        required: function(element) {
        var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return (!($("#email-id").val() > ' ' && filter.test($("#email-id").val())));
       },
       number: true,
       minlength: 10,
       maxlength: 10,
      },
      address: {
        required: true,
      },
      gender: {
        required: true,
        validateGender: true,
      },
      country: {
        required: true,
        validateCountry: true,
      },
      check: {
        required: true,
      }
    },
    messages: {
      name: "Please enter your name",
      email: "Please enter a valid email",
      age: "Please enter the valid age(between 18-32)",
      date: "Please enter the valid date",
      color: "Please enter the valid color",
      mobile: "Please enter a valid mobile No.(of 10 digits)",
      gender: "Please select one of the two",
      country: "Please enter your country's name",
      check: "You must select atleast one",
    },
    errorPlacement: function(error, element) {
      if(element.attr("name") == "gender") {
        error.appendTo( element.parent("div").next("div"));
      } else {
        error.insertAfter(element);
      }
    }
  });
  jQuery.validator.addMethod("validateName", function(value, element) {
    var totalWords = value.split(" ");
    var letters = /^[A-Za-z]+$/;
    return (value.indexOf(" ") > 0 && totalWords[1] != '');
  });
  jQuery.validator.addMethod("validateEmail", function(value, element) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return (filter.test(value));
  });
  jQuery.validator.addMethod("validateCountry", function(value, element) {
    return (value != "Select Country");
  });
  jQuery.validator.addMethod("validateDate", function(value, element) {
    var GivenDate = value;
    var CurrentDate = new Date();
    GivenDate = new Date(GivenDate);
    if(GivenDate < CurrentDate){
      return true;
    }
  });
});
function readURL(input) {
      if (input.files && input.files[0]) {
          var reader = new FileReader();

          reader.onload = function (e) {
              $('#image-preview')
                  .attr('src', e.target.result)
                  .width(200)
                  .height(150);
          };

          reader.readAsDataURL(input.files[0]);
      }
  }
