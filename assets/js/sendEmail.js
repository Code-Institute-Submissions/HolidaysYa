function sendMail(contactForm) {
    emailjs.send("gmail", "firsttemplate", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.email.value,
        "info": contactForm.info.value
    })
        .then(
            function (response) {
                showInfoMessageSuccess();
                $('#infoMessage').html(`<h2>Email successfully sent</h2>`);
                //this code is used to hide the modal after the submit button is pressed
                $('#myModal').modal('hide');
            },
            function (error) {
                showInfoMessageError();
                $('#infoMessage').html(`<h2>Email not sent, please try again!</h2>`);
            }
        );
    return false;  // To block from loading a new page
}