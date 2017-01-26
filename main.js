 if (window.location.hostname === '127.0.0.1') {
    window.location = 'http://localhost:1898';
}

var auth2;

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $('.g-signin2').hide();
}

function appStart() {
    gapi.load('auth2', initSigninV2);
}

function signinChanged(isSignedIn) {
    console.log('signinChanged() = ' + isSignedIn);
    if (isSignedIn) {
        console.log('the user must be signed in to print this');
        var googleUser = auth2.currentUser.get();
        var authResponse = googleUser.getAuthResponse();
        var profile = googleUser.getBasicProfile();
        
        $('#email').html('<h3>' + profile.getEmail() + '</h3>');
        $('#photo').html('<img src="' + profile.getImageUrl() + '">');
    }
    else {
        console.log('the user must not be signed in if this is printing');
    }
}

function initSigninV2() {
    auth2 = gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(signinChanged);
    auth2.currentUser.listen(userChanged);
    if (auth2.isSignedIn.get() == true) {
        auth2.signIn();
    }
}

function route(url) {
   return 'http://192.168.1.9:3000' + url;
}

var profile; // google user profile
var authResponse; // google user auth response

function onSignIn(googleUser) {
   profile = googleUser.getBasicProfile();
   authResponse = googleUser.getAuthResponse();

   var login = {
       'id': profile.getId(),
       'name': profile.getName(),
       'givenName': profile.getGivenName(),
       'familyName': profile.getFamilyName(),
       'imageUrl': profile.getImageUrl(),
       'email': profile.getEmail(),
       'hostedDomain': googleUser.getHostedDomain()
   }

   post('/login', login);

   $('.g-signin2').hide();
   $('#email').html('<p>' + profile.getEmail() + '</p>');
   $('#photo').html('<img src="' + profile.getImageUrl() + '">');
}

function signOut() {
   gapi.auth2.getAuthInstance().signOut();
   $('.g-signin2').show();
   $('#email').html('');
   $('#photo').html('');
}

function disconnect() {
   gapi.auth2.getAuthInstance().disconnect();
   $('.g-signin2').show();
   $('#email').html('');
   $('#photo').html('');
}

/**
* Generic post with Authorization in every header
*/
function post(url, json, success, error) {
   $.ajax({
       url: route(url),
       method: 'POST',
       data: json,
       headers: {
           'Authorization': authResponse.id_token
       },
       success: function() {
           if (success) success();
       },
       error: function() {
           if (error) error();
       }
   });
}
