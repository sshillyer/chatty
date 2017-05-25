import * as React from 'react';

export default ({ body, title }: any) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font: 13px Helvetica, Arial; }
      form { background: #000; padding: 3px; width: 100%; }
      form input { border: 0; padding: 10px; width: 90%; margin-right: .5%; }
      form button { width: 9%; background: rgb(130, 224, 255); border: none; padding: 10px; }
      #loginForm { position: fixed; top: 0; }
      #messageForm { position: fixed; bottom: 0 }
      #messages { list-style-type: none; margin: 0; padding: 0 0 25px 0; position: fixed; top: 4em; }
      #messages li { padding: 5px 10px; }
      #messages li:nth-child(odd) { background: #eee; }
    </style>

  </head>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.0.1/socket.io.js"></script>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
      <script>

        $(function () {
          var socket = io('http://localhost:8080');


          $('form[name="message-form"]').submit(function(){
            var message = $('#m').val();
            console.log(message);
            var username = $('#uname').val();
            console.log(username);

            socket.emit('chat message', '{"username":"' + username + '","message":"' + message +'"}' );
            $('#m').val('');
            return false;
          });


          socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg));
          });


          $('form[name="login-form"]').submit(function(){
            socket.emit('user login', $('#user').val());
            window.location.href = "/" + $('#user').val();
            $('#user').val('');
            return false;
          });

          window.addEventListener("beforeunload", function () {
            var username = $('#uname').val();
            if (username != null && /\S/.test(username)) {
              socket.emit('user disconnected', username);
            }
            
          });

        });
    </script>

  <body>
    ${body}
  </body>
</html>
  `;
};




