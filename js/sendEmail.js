
function sendMail(contactForm){
    emailjs.send("gmail", "firsttemplate", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.email.value,
        "info": contactForm.info.value
     })
.then(
    function(response){
        console.log("SUCCESS", response);
    },
    function(error){
        console.log("ERROR", error);
    });
}

