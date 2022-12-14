/*jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function () {

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', (e) => load_mailbox('inbox', e));
    document.querySelector('#sent').addEventListener('click', (e) => load_mailbox('sent', e));
    document.querySelector('#archived').addEventListener('click', (e) => load_mailbox('archive', e));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function compose_email() {

    document.querySelector('#message').innerHTML = '';
    document.querySelector('#heading').innerHTML = '';

    // Show compose view and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'none';
//  document.querySelector('#emailId').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';

    // Clear out composition fields
    document.getElementById('#compose-recipients').value = ' ';
    document.getElementById('#compose-subject').value = ' ';
    document.getElementById('#compose-body').value = ' ';
    const myForm = document.getElementById('compose-form');
    myForm.addEventListener('submit', function (e){
        e.preventDefault();
        const formData = new FormData(this);
        console.log(myForm)
        fetch('/emails', {
            method : 'post',
            body:formData
        }).then((response) => {
           return response.json();
        }).then( (text) => {
              if (text['message'] === 'success') {
                    console.log(text['message']);
                    document.querySelector('#message').innerHTML = `<h3 class="alert-success"> ${'Email Sent Successfully!'}</h3>`;
                    setTimeout(function(){ load_mailbox('sent'); }, 2000);
              } else {
                    console.log(text['error']);
                     document.querySelector('#message').innerHTML = `<h3 class="alert-danger"> ${text['error']}</h3>`;
              }
                    console.log(text);
            });

    });

}

function showAll() {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#email-detail-view').style.display = 'block';
}

function showComposeToReply() {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#email-detail-view').style.display = 'none';
}

function showDetailView() {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'block';
//  document.querySelector('#emailId').style.display = 'none';

}

let addDataAndShowView = (e) => {
    // first, get email for the related id
    fetch(`/emails/${e.target.id}`)
    .then(data => {
        return data.json();
    })
    .then(email => {
        console.log('email', email);
        // set email as read
        fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
        });

        //  show email
        showDetailView();
        document.getElementById("#from").innerHTML = `<b>From: </b>${email.sender}`;
        document.getElementById("#to").innerHTML = `<b>To: </b>${email.recipients}`;
        document.getElementById("#subject").innerHTML = `<b>Subject: </b>${email.subject}`;
        document.getElementById("#timestamp").innerHTML = `<b>Timeframe: </b>${email.timestamp}`;
        document.getElementById("#body").innerHTML = `<b>Body: </b>${email.body}`;
        document.getElementById("isreadcheckbox").checked = email.read;
        document.getElementById("#emailId").value = email.id;

        if (email.sender === document.querySelector('.current_user_email').innerText) {
            document.querySelector("#archiveId").classList.add('d-none');
            document.querySelector("#replyId").classList.add('d-none');
        }
    });


}

// Load emails in index page
function load_mailbox(mailbox, event = Event.NONE) {
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'none';
    const allEmailContainer = document.querySelector("#emails-view");
    allEmailContainer.replaceChildren("");
    // Send a GET request to the URL to retrieve all posts
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(data => {
            setTimeout(function(){ console.log('loading...') }, 500);
            data.forEach(email => {
                const element = document.createElement('div');
                const emailId = `#email-${email.id}`;
                const replyId = `reply-+${emailId}`;
                element.style.textDecoration = 'none';
                element.classList.add('HoverClass1');
                element.setAttribute('id', `email-${email.id}`);
                element.classList.add('d-flex', 'flex-column', 'justify-content-between', 'p-4', 'm-3', 'lead', 'border', 'rounded', 'color-notread');
                element.style.color = '#000000';
                if (email.read) {
                    element.classList.remove('color-notread');
                    element.classList.add('color-read-bg');
                } else {
                    element.classList.add('color-unread-bg');
                }
                if (email.archived) {
                    element.innerHTML =
                        `
                <div class="row">
                    <div class="col-10">
                    <button class="card color-archive w-100 email" id="#email">
                        <div class="bd-highlight">${email.subject}</div>
                        <div class="flex-fill bd-highlight">${email.sender}</div>
                        <div class="bd-highlight font-weight-bolder mr-5">${email.timestamp}</div>
                    </button>
                    </div>
                    <div class="col-2 d-flex justify-content-center align-self-center h-50">
                        <button class="btn btn-primary unarchive-email" id="${email.id}">
                            Un-Archive
                        </button>
                    </div>
                </div>

                `;
                } else {
                    element.innerHTML =
                        `
                <button class="card color-unarchive email" id="${email.id}">
                <div class="bd-highlight">Subject: ${email.subject}</div>
                <div class="flex-fill bd-highlight">From: ${email.sender}</div>
                <div class="bd-highlight font-weight-bolder mr-5">${email.timestamp}</div></button>

                `;
                }

                allEmailContainer.append(element);

                const linePost = document.querySelector(emailId);
                linePost.addEventListener('click', (event) => {
                    console.log(event);
                });

            });
            // event to view email
            document.querySelectorAll('.email').forEach(element => {
                element.addEventListener('click', (event) => addDataAndShowView(event))
            });
            // event to mark single email as read or unread
            document.querySelector("#isreadcheckbox").addEventListener('change', function (event) {
                const email_id = document.getElementById('#emailId').value
                if (this.checked) {
                    fetch(`/emails/${email_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            read: true
                        })
                    });
                } else {
                    fetch(`/emails/${email_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            read: false
                        })
                    });
                }
            });
            // event to mark single email as archived
            document.querySelector("#archiveId").addEventListener('click', (event) => {
                const email_id = document.getElementById("#emailId").value
                fetch(`/emails/${email_id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: true
                    })
                }).then(res => {
                    return res.json();
                }).then(result => {
                    setTimeout(function(){ load_mailbox('inbox'); }, 2000);
                    console.log(result)
                })
            });

            // event to mark single email as archived
            document.querySelectorAll(".unarchive-email").forEach(element => {
                element.addEventListener('click', (event) => {
                    const email_id = event.target.id
                    fetch(`/emails/${email_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            archived: false
                        })
                    }).then(res => {
                        return res.json();
                    }).then(result => {
                        setTimeout(function(){ load_mailbox('inbox'); }, 1500);
                        console.log(result)
                    })
                });

            })

            // event to make replies
             document.querySelector("#replyId").addEventListener('click', (event) => {
                    showComposeToReply();
                    const email_id = document.getElementById("#emailId").value
                    document.getElementById("heading").innerHTML = '';
                    document.getElementById("compose_heading").innerText = "Reply";

                    fetch(`/emails/${email_id}`)
                        .then(data => {
                            return data.json();
                        })
                        .then(email => {
                            console.log('email', email);
                            document.getElementById("#compose-sender").value = `${email.sender}`;
                            document.getElementById("#compose-recipients").value = `${email.recipients}`;
                            document.getElementById("#compose-subject").value = `Re| ${email.subject}`;
                            document.getElementById("#compose-body").value = `${email.body}`;
                        });

                     const myForm = document.getElementById('compose-form');
                     myForm.addEventListener('submit', function (e) {
                        e.preventDefault();
                        const formData = new FormData(this);
                        console.log(myForm);
                        fetch('/emails', {
                            method : 'post',
                            body:formData
                        }).then(function (response){
                            return response.json();
                        }).then( (text) => {
                            if (text['message'] === 'success') {
                                    console.log(text['message']);
                                    document.querySelector('#message').innerHTML = `<h3 class="alert-success"> ${'Email Sent Successfully!'}</h3>`;
                                    setTimeout(function(){ load_mailbox('sent'); }, 2000);
                            } else {
                                    console.log(text['error']);
                                    document.querySelector('#message').innerHTML = `<h3 class="alert-danger"> ${text['error']}</h3>`;
                            }
                                    console.log(text);
                        });

                    });
                });

            document.querySelector('#heading').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
        })
        .catch(error => {
            console.log(error);
        });
    return false;


    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#emailId').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'none';

    // Show the mailbox name
    document.querySelector('#heading').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


}
