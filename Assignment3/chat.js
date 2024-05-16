$(document).ready(function() {
    // Your JavaScript code here

// var useremail = sessionStorage.getItem('email');
console.log("retrieve session useremail normally:"+useremail);

function scrollToBottom() {
    var messageWindow = $('.message-window')[0]; // Get the DOM element

    if (messageWindow) {
        messageWindow.scrollTop = messageWindow.scrollHeight;
    }
}

// Call the scrollToBottom function every time new chat messages are added
function displayChatMessages(chatMessages) {
    chatMessages.forEach(function(message) {
        var messageElement = $('<div>').addClass('message');
        console.log(message);
        // Determine the message position based on the current user
        if (message.person === useremail.split('@')[0]) {
            messageElement.addClass('right');
        } else {
            messageElement.addClass('left');
        }
        
        // Create elements for username, time, and message content
        var usernameElement = $('<span>').addClass('username').text(message.person);
        var timeElement = $('<span>').addClass('time').text(message.time);
        var contentElement = $('<span>').addClass('content').text(message.message);
        
        // Append the elements to the message element
        messageElement.append(usernameElement, timeElement, contentElement);
        
        // Append the message element to the message window
        $('.message-window').append(messageElement);
    });
    
    // Scroll to the bottom of the message window
    scrollToBottom();
}

function getChatMessages() {
    $.ajax({
        url: 'chatmsg.php',
        type: 'GET',
        success: function(response) {
            var chatMessage = JSON.parse(response); 
            var Messages = chatMessage.messages;
            console.log('chatMessages:', Messages);
            if (Array.isArray(Messages)) {
                displayChatMessages(Messages);
            } 
        },
        error: function(error) {
            console.log('Error retrieving chat messages:', error);
        }
    });
}

function handleSendButtonClick() {
    var content = $('#message-input').val();
    if (content.trim() === '') {
        console.log('Message is blank');
        return;
    }
    var user = useremail.split('@')[0];
    var currentTime = new Date().toLocaleTimeString();
    console.log(currentTime);
    // Make an AJAX POST request to chatmsg.php
    $.ajax({
        url: 'chatmsg.php',
        type: 'POST',
        data: {message: content, person: user, time: currentTime  },
        success: function(response) {
            // Display the sent message in the message window
            console.log('Message sent:', response);
            var messageElement = $('<div>').addClass('right');
            var usernameElement = $('<span>').addClass('username').text(user);
            var timeElement = $('<span>').addClass('time').text(currentTime);
            var contentElement = $('<span>').addClass('content').text(content);

            messageElement.append(usernameElement, timeElement, contentElement);
            $('.message-window').append(messageElement);
        },
        error: function(error) {
            console.log('Error sending chat message:', error);
        }
    });

    // Clear the input field
    $('#message-input').val('');
}

// Attach the handleSendButtonClick function to the send button click event
getChatMessages();
$('#send-button').click(handleSendButtonClick);

//interval = setInterval(getChatMessages, 5000);


});