/*jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', (e) => load_mailbox('inbox',e));
  document.querySelector('#sent').addEventListener('click', (e) => load_mailbox('sent',e));
  document.querySelector('#archived').addEventListener('click', (e) => load_mailbox('archive',e));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {
    console.log("ffggg")
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



  document.getElementById("#btncompose").addEventListener('click', (event) => {
  event.preventDefault();
  const recipient = document.getElementById('#compose-recipients').value
  const subject = document.getElementById('#compose-subject').value
  const body = document.getElementById('#compose-body').value
  console.log(recipient)
  console.log(subject)
  console.log(body)
                fetch('/emails',{
                    method:'post',
                    body:JSON.stringify({
                        recipients:`${recipient}`,
                        subject:`${subject}`,
                        body:`${body}`
                    })
                }).then((response) => {
           return response.json();
        }).then( (text) => {
                console.log(text)
              if (text['message']) {
                    console.log(text['message']);
                    document.querySelector('#message').innerHTML = `<h3 class="alert-success"> ${'Email Sent Successfully!'}</h3>`;
                    setTimeout(function(){ load_mailbox('sent'); }, 2000);
              } else {

                     document.querySelector('#message').innerHTML = `<h3 class="alert-danger"> ${text['error']}</h3>`;
              }
                    console.log(text);
            });
            });
  // params = {
  //     url : '',
  //     method: 'post',
  //     header:{
  //         'content-type': 'application/json'
  //     },
  //     body: JSON.stringify(
  //         data
  //     )
  // }





}

// function load_mailbox(mailbox) {
//   fetch(`/emails/${mailbox}`)
//   .then(response => response.json())
//   .then (text => {
//       document.querySelector('#emails-view').innerHTML = text;
//       const { id , body } = text;
//       console.log(id)
//       console.log(body)
//   })

function showAll() {
  document.getElementById("#btncompose").addEventListener('click', (event) => {
  const recipient = document.getElementById('#compose-recipients').value
  const subject = document.getElementById('#compose-subject').value
  const body = document.getElementById('#compose-body').value
  console.log(recipient)
  console.log(subject)
  console.log(body)
                fetch(`/emails`,{
                    method:'POST',
                    body:JSON.stringify({
                        recipients:`${recipient}`,
                        subject:`${subject}`,
                        body:`${body}`
                    })
                });
            });
    document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-detail-view').style.display = 'block';
//  document.querySelector('#emailId').style.display = 'none';
}
function showDetailView() {
document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-detail-view').style.display = 'block';
//  document.querySelector('#emailId').style.display = 'none';

  }
  // Load emails in index page
function load_mailbox(mailbox, event) {
//    event.preventDefault;
//    window.location.reload()
//    reload()
//window.location = window.location
document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
//    document.querySelector('#emailId').style.display = 'none';
    document.querySelector('#email-detail-view').style.display = 'none';
    const allEmailContainer = document.querySelector("#emails-view");
    allEmailContainer.replaceChildren("")
//    while (myNode.lastElementChild) {
//    myNode.removeChild(myNode.lastElementChild);
//  }
//    const allEmailContainer = document.getElementById("#emails-view");
//    while (allEmailContainer.firstChild) {
//    allEmailContainer.removeChild(myNode.lastChild);
//  }
//    allEmailContainer.remove()
//    allEmailContainer.reload(true)
//    const element = ""
//    allEmailContainer.append(element)
    // Send a GET request to the URL to retrieve all posts
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(email => {
            // const { fields } = email;
//            allEmailContainer.reload()

            const element = document.createElement('div');
            const emailId = `#email-${email.id}`;
            const replyId = `reply-+${emailId}`
            var rId = email.id
            console.log(emailId)
            element.style.textDecoration = 'none';
            element.classList.add('HoverClass1');
            element.setAttribute('id', `email-${email.id}`);
            element.classList.add('d-flex', 'flex-column' ,'justify-content-between', 'p-4', 'm-3', 'lead', 'border', 'rounded','color-notread');
            element.style.color = '#000000';
            if(email.read){
               element.classList.remove('color-notread')
               element.classList.add('color-read')
            }else{
                element.classList.remove('color-notread')
               element.classList.add('color-notread')
            }
            if(email.archived){
                element.innerHTML =
                `
                    <div class="row">
                    <div class="col-10">
                    <button class="card color-archive w-100 email" id=${emailId}>
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
            }else{
                element.innerHTML =
                `

                <div class="card color-unarchive" id=${emailId}>
                <div class="bd-highlight">${email.body}</div>
                <div class="flex-fill bd-highlight">${email.sender}</div>
                <div class="bd-highlight font-weight-bolder mr-5">${email.timestamp}</div></div>

                `;
            }



            console.log(email);

            allEmailContainer.append(element);
            document.getElementById(emailId).addEventListener('click', (event) => {
                showDetailView()
                fetch(`/emails/${email.id}`,{
                    method:'PUT',
                    body:JSON.stringify({
                        read:true
                    })
                });
                document.getElementById("#from").innerHTML = `<b>From: </b>${email.sender}`
                document.getElementById("#to").innerHTML = `<b>To: </b>${email.recipients}`
                document.getElementById("#subject").innerHTML = `<b>Subject: </b>${email.subject}`
                document.getElementById("#timestamp").innerHTML = `<b>Timeframe: </b>${email.timestamp}`
                document.getElementById("#emailId").value = email.id
                console.log(document.getElementById("#emailId").value)
                document.querySelector("#replyId").addEventListener('click', (event) => {
                compose_email()
                document.getElementById("#compose-recipients").value = `${email.recipients}`
                document.getElementById("#compose-subject").value = `Re: ${email.subject}`
                document.getElementById("#compose-body").value = `${email.body}`
                document.getElementById("#emailId").value = email.id

            });
            });
                document.querySelectorAll(".unarchive-email").forEach(element => {
                element.addEventListener('click', (event) => {
                    const email_id = event.target.id
                    fetch(`/emails/${email_id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            archived: false
                        })
                    }).then(result => {
                        setTimeout(function(){ load_mailbox('inbox'); }, 1500);
                        console.log(result)
                    })
                });

            })
            document.querySelector("#archiveId").addEventListener('click', (event) => {
//            fetch('/emails/${email.id}',{method:'PUT'},body:JSON.stringify({
//                archived:!email.archived
//            }))
//            .then(response => console.log(response.json()))
//            .then(data => {
//                console.log(data)
//            });
                const email_id = document.getElementById("#emailId").value
                fetch(`/emails/${email_id}`,{
                    method:'PUT',
                    body:JSON.stringify({
                        archived:true
                    })
                }).then(result =>{
                    document.querySelector('#archivemessage').innerHTML = `<h3 class="alert-success"> ${'Email Archived Success!'}</h3>`;
                    load_mailbox('inbox');
                });
            });
//            document.querySelector("#isreadcheckbox").addEventListener('change', function() {
//              if (this.checked) {
//                fetch(`/emails/${email.id}`,{
//                    method:'PUT',
//                    body:JSON.stringify({
//                        read:true
//                    })
//                });
//              } else {
//                fetch(`/emails/${email.id}`,{
//                    method:'PUT',
//                    body:JSON.stringify({
//                        read:false
//                    })
//                });
//              }
//            });
            const linePost = document.querySelector(emailId);
            linePost.addEventListener('click', (event) => {
                console.log(event);
            });

        });
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




