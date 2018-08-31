//initialize modal
$(document).ready(function () {
    $('.modal').modal();

//get request for articles, appending first 10 to page with fave button, note button
$.getJSON("/article", function (data) {
    console.log(data.reverse());
    for (var i = 0; i < 10; i++) {
        $("#articles").append(`
        <section>
            <h3>${data[i].headline}</h3>
            <h4>
                <a href= "${data[i].link}" target="_blank">${data[i].link}</a></h4>

            <button class="add-fave-button" data-fave-id=${data[i]._id}><i class="fas fa-heart"></i></button>

            <a class = "waves-effect waves-light btn modal-trigger add-note" data-target = "modal1" href = "#modal1" data-article-id=${data[i]._id}> Add a Note </a>

        </section>
        `);
    };
});

//when 'add note' is clicked, display all other notes on this article
$(document).on("click", ".add-note", function () {
    $(".your-notes").empty();
    var thisId = $(this).data("article-id");
    console.log(thisId);
    $.ajax({
            method: "GET",
            url: "/notes-articles/" + thisId
        })
        .then(function (data) {
            for (var i = 0; i < data.length; i++) {
                $(".your-notes").append(`
                <section class="note-body-parent">
                        <p>${data[i].title}</p>
                        <p>${data[i].note}</p>

                        <button id="delete" data-note-del=${data[i]._id}><i class="fas fa-trash-alt"></i></button>
                </section>
                        `)
            };
        });

//when note submit is clicked, add to mongo
    $(document).on("click", ".add-note-input", function () {
        var thisId = $(".add-note").data("article-id");
        var title = $("#titleinput").val();
        var bodyInput = $("#bodyinput").val();
        console.log(title, bodyInput);
        $.ajax({
            method: "POST",
                url: "/article/" + thisId,
                data: {
                    // Value taken from title input
                    title: $("#titleinput").val(),
                    // Value taken from note textarea
                    note: $("#bodyinput").val(),
                    articleId: thisId
                }
            }).then (
                $("#titleinput").val(""),
                $("#bodyinput").val(""),
                console.log("note added to database")
            )
        });
});

//delete note function on button click
$(document).on("click","#delete", function(){
    var thisId = $(this).data("note-del");
    var selected = $(this).parent();
    console.log(thisId);
    $.ajax({
        method:"DELETE",
        url: "/notes-article/" + thisId,
        success: function(response){
            selected.remove();
            $("#titleinput").val("");
            $("#bodyinput").val("");
            selected.val("");
        }
    })
});

//change favorite value to true if 'favorite' button clicked
$(document).on("click", ".add-fave-button", function(){
    var thisId = $(this).data("fave-id");
    console.log(thisId);
    $.ajax({
        method: "POST",
        url: "/favourites/" + thisId,
        data: {
            favorite: true
        }
    })
        .then(function (data) {
            console.log(data);
        });

});

//on click of favourite in nav, display favourite = true
$(document).on("click", ".faves",function () {
    $.getJSON("/favourites", function (data) {
        $("#articles").empty();
        $("#articles").append(`<h2>Favourite Articles</h2>`);
        for (var i = 0; i < data.length; i++) {
            $("#articles").append(`
            <section>
                    <h3> <a href= "${data[i].link}" target="_blank"> ${data[i].headline}</a></h3>

                    <button class="remove-fave" data-id=${data[i]._id}><i class="fas fa-trash-alt"></i></button>


                    </section>
                    `);
        };

        //TODO: cleaner way to do this rather than create a new route??
        $(".remove-fave").on("click", function () {
            console.log('removing');
            var thisRemove = $(this).data("id");
            $.ajax({
                    method: "POST",
                    url: "/removefavourites/" + thisRemove,
                    data: {
                        favorite: false
                    }
                })
                .then(function (data) {
                    console.log(data);
                });
        })
    })
});

//when scrape button clicked, scrape new articles
$(document).on("click", "#scrape", function () {
    window.location = "http://localhost:3000/scrape";
});

});