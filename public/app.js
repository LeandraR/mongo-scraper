$.getJSON("/article", function (data) {
    console.log(data);
    for (var i = 0; i < 10; i++) {
        $("#articles").append(`<h3> <a href= "${data[i].link}" target="_blank"> ${data[i].headline}</a></h3> <button class="add-note" data-id=${data[i]._id}>Note</button> <div class="note-form">
        </div>`)
        //data-favorite = true for favorite button
    }
});

$(".faves").on("click", function(){
    $.getJSON("/favourites", function (data) {
        console.log(data);

        //data-favorite = true for favorite button
    })


});



$(document).on("click", "#scrape", function () {
    window.location = "http://localhost:3000/scrape";
});

$(document).on("click", ".add-note", function () {
    var id = $(this).data("id");
    $(".note-form").html(`<input type="text" id="titleinput"><input type="text-area" id="bodyinput"><button class="add-note-input" data-id-note=${id}>Add Note</button>`)
});

$(document).on("click", ".add-note-input", function () {
    var thisId = $(this).data("id-note");
    var title = $("#titleinput").val();
        // Value taken from note textarea
    var bodyInput = $("#bodyinput").val();
    alert(title+ bodyInput);
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
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
        });

});




$(document).on("click", "p", function () {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/article/" + thisId
        })
        // With that done, add the note information to the page
        .then(function (data) {
            console.log(data);
            // The title of the article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // An input to enter a new title
            $("#notes").append("<input id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.note) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.note.body);
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/article/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});
