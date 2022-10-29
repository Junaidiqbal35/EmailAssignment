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
        }).then(function (response){
            return response.json();
        }).then(function (text){
              if (text.status === 201) {
                    console.log(text['message']);
                       document.querySelector('#message').innerHTML = `<h3 class="alert-success"> ${text['message']}</h3>`;
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

function showDetailView() {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'block';
//  document.querySelector('#emailId').style.display = 'none';

}

// Load emails in index page
function load_mailbox(mailbox, event) {
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
//    document.querySelector('#emailId').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'none';
    const allEmailContainer = document.querySelector("#emails-view");
    allEmailContainer.replaceChildren("");
    // Send a GET request to the URL to retrieve all posts
    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(email => {
                const element = document.createElement('div');
                const emailId = `#email-${email.id}`;
                const replyId = `reply-+${emailId}`;
                console.log(emailId);
                element.style.textDecoration = 'none';
                element.classList.add('HoverClass1');
                element.setAttribute('id', `email-${email.id}`);
                element.classList.add('d-flex', 'flex-column', 'justify-content-between', 'p-4', 'm-3', 'lead', 'border', 'rounded', 'color-notread');
                element.style.color = '#000000';
                if (email.read) {
                    element.classList.remove('color-notread');
                    element.classList.add('color-read');
                } else {
                    element.classList.remove('color-notread');
                    element.classList.add('color-notread');
                }
                if (email.archived) {
                    element.innerHTML =
                        `
                <button class="card color-archive" id="#email">
                <div class="bd-highlight">${email.body}</div>
                <div class="flex-fill bd-highlight">${email.sender}</div>
                <div class="bd-highlight font-weight-bolder mr-5">${email.timestamp}</div></button>

                `;
                } else {
                    element.innerHTML =
                        `
                <button class="card color-unarchive" id="#email">
                <div class="bd-highlight">${email.body}</div>
                <div class="flex-fill bd-highlight">${email.sender}</div>
                <div class="bd-highlight font-weight-bolder mr-5">${email.timestamp}</div></button>

                `;
                }


                console.log(email);

                allEmailContainer.append(element);
                document.getElementById("#email").addEventListener('click', (event) => {
                    showDetailView();
                    document.getElementById("#from").innerHTML = `<b>From: </b>${email.sender}`;
                    document.getElementById("#to").innerHTML = `<b>To: </b>${email.recipients}`;
                    document.getElementById("#subject").innerHTML = `<b>Subject: </b>${email.subject}`;
                    document.getElementById("#timestamp").innerHTML = `<b>Timeframe: </b>${email.timestamp}`;
                    document.getElementById("#emailId").value = email.id;
                });
                document.querySelector("#replyId").addEventListener('click', (event) => {
                    showAll();
                    document.getElementById("#compose-recipients").value = `${email.recipients}`;
                    document.getElementById("#compose-subject").value = `Re|${email.subject}`;
                    document.getElementById("#compose-body").value = `${email.body}`;

                     const myForm = document.getElementById('compose-form');
                     myForm.addEventListener('submit', function (e){
                    e.preventDefault();
                    const formData = new FormData(this);
                    console.log(myForm);
                    fetch('/emails', {
                        method : 'post',
                        body:formData
                    }).then(function (response){
                        return response.json();
                    }).then(function (text){
                          if (text.status === 201) {
                                console.log(text['message']);
                                   document.querySelector('#message').innerHTML = `<h3 class="alert-success"> ${text.message}</h3>`;
                          } else {
                                console.log(text['error']);
                                 document.querySelector('#message').innerHTML = `<h3 class="alert-danger"> ${text.error}</h3>`;
                          }
                                console.log(text);
                        });

                });










                });
                document.querySelector("#archiveId").addEventListener('click', (event) => {
//            fetch('/emails/${email.id}',{method:'PUT'},body:JSON.stringify({
//                archived:!email.archived
//            }))
//            .then(response => console.log(response.json()))
//            .then(data => {
//                console.log(data)
//            });
                    const email_id = document.getElementById("#emailId").value
                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            archived: !email.archived
                        })
                    });
                });
                document.querySelector("#isreadcheckbox").addEventListener('change', function () {
                    if (this.checked) {
                        fetch(`/emails/${email.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                read: true
                            })
                        });
                    } else {
                        fetch(`/emails/${email.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                read: false
                            })
                        });
                    }
                });
                const linePost = document.querySelector(emailId);
                linePost.addEventListener('click', (event) => {
                    console.log(event);
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




