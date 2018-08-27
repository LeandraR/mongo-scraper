//initialize modal
$(document).ready(function () {
    $('.modal').modal();
});


//get request for articles, appending first 10 to page with fave button, note button
$.getJSON("/article", function (data) {
    console.log(data.reverse());
    for (var i = 0; i < 10; i++) {
        $("#articles").append(`<h3> <a href= "${data[i].link}" target="_blank"> ${data[i].headline}</a></h3>
        <h4><a href= "${data[i].link}" target="_blank">${data[i].link}</a></h4>

        <button class="add-fave-button" data-fave-id=${data[i]._id}><i class="fas fa-heart">Add Favourite</i></button>

        <a class="waves-effect waves-light btn modal-trigger" href="#modal1" data-id=${data[i]._id}>Add a Note</a>

        <div id="modal1" class="modal">
            <div class="modal-content">
                <h5>Add a Note to this Article:</h5>
                <input type="text" id="titleinput" placeholder="Note title">
                <input type="text-area" id="bodyinput" placeholder="Note text">
                <button class="add-note-input" data-id-note="id">Add
                    Note</button>
            </div>
            <div class="modal-footer">
                <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
            </div>
        </div>
        `);
    };
});

//change favorite value to true if 'favorite' button clicked
$(document).on("click", ".add-fave-button", function(){
    var thisId = $(this).data("fave-id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/favorites/" + thisId,
        data: {
            favorite: true
        }
    })
        .then(function (data) {
            console.log(data);
        });

});



//on click of favourites button, display favourite = true
$(".faves").on("click", function(){
    $.getJSON("/favourites", function (data) {
        $("#articles").empty();
        $("#articles").append(`<h2>Favourite Articles</h2>`);
        for (var i = 0; i < data.length; i++) {
            $("#articles").append(`
                    <h3> <a href= "${data[i].link}" target="_blank"> ${data[i].headline}</a></h3>

                    <button class="add-note" data-id=${data[i]._id}>Note</button>


                    `);
        }
    })
});


//when scrape button clicked, scrape new articles
$(document).on("click", "#scrape", function () {
    window.location = "http://localhost:3000/scrape";
});

//when add note button clicked, show note input
// $(document).on("click", ".add-note", function () {
//     var id = $(this).data("id");
//     $(".note-form").html(`
//     <input type="text" id="titleinput"><input type="text-area" id="bodyinput"><button class="add-note-input" data-id-note=${id}>Add Note</button>`)
// });

//when add note submit is clicked, take text input & post to mongo
$(document).on("click", ".add-note-input", function () {
    var thisId = $(this).data("id-note");
    var title = $("#titleinput").val();
        // Value taken from note textarea
    var bodyInput = $("#bodyinput").val();
    console.log(title, bodyInput)
    $.ajax({
            method: "POST",
            url: "/article/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                note: $("#bodyinput").val()
            }
        })
        .then(function (data) {
            console.log(data);
        });

});









// $(document).on("click", "p", function () {
//     // Empty the notes from the note section
//     $("#notes").empty();
//     // Save the id from the p tag
//     var thisId = $(this).attr("data-id");

//     // Now make an ajax call for the Article
//     $.ajax({
//             method: "GET",
//             url: "/article/" + thisId
//         })
//         // With that done, add the note information to the page
//         .then(function (data) {
//             console.log(data);
//             // The title of the article
//             $("#notes").append("<h2>" + data.title + "</h2>");
//             // An input to enter a new title
//             $("#notes").append("<input id='titleinput' name='title' >");
//             // A textarea to add a new note body
//             $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//             // A button to submit a new note, with the id of the article saved to it
//             $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

//             // If there's a note in the article
//             if (data.note) {
//                 // Place the title of the note in the title input
//                 $("#titleinput").val(data.note.title);
//                 // Place the body of the note in the body textarea
//                 $("#bodyinput").val(data.note.body);
//             }
//         });
// });

// // When you click the savenote button
// $(document).on("click", "#savenote", function () {
//     // Grab the id associated with the article from the submit button
//     var thisId = $(this).attr("data-id");

//     // Run a POST request to change the note, using what's entered in the inputs
//     $.ajax({
//             method: "POST",
//             url: "/article/" + thisId,
//             data: {
//                 // Value taken from title input
//                 title: $("#titleinput").val(),
//                 // Value taken from note textarea
//                 body: $("#bodyinput").val()
//             }
//         })
//         // With that done
//         .then(function (data) {
//             // Log the response
//             console.log(data);
//             // Empty the notes section
//             $("#notes").empty();
//         });

//     $("#titleinput").val("");
//     $("#bodyinput").val("");
// });
