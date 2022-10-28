/*jshint esversion: 6 */
document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

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


  // Load emails in index page
function load_mailbox(mailbox, event) {
    document.querySelector('#compose-view').style.display = 'none';

    // Send a GET request to the URL to retrieve all posts
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(email => {
            // const { fields } = email;
            const allEmailContainer = document.querySelector("#emails-view");
            const element = document.createElement('div');
            const emailId = `#email-${email.id}`;
            console.log(emailId)
            element.style.textDecoration = 'none';
            element.classList.add('HoverClass1');
            element.setAttribute('id', `email-${email.id}`);
            element.classList.add('d-flex', 'flex-column' ,'justify-content-between', 'p-4', 'm-3', 'lead', 'border', 'rounded');
            element.style.color = '#000000';
            element.innerHTML =

                `
                <a href="http://127.0.0.1:8000/emails/${email.id}">
                <div class="bd-highlight">${email.body}</div>
                <div class="flex-fill bd-highlight">${email.sender}</div>
                <div class="bd-highlight font-weight-bolder mr-5">${email.timestamp}</div></a>`;


            console.log(email);

            allEmailContainer.append(element);

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

  // Show the mailbox name
  document.querySelector('#heading').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}




