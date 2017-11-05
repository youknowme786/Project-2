console.log("main.js is linked");
$(document).ready(function() {
    function populateBook(isbn) {
        var apiKey = "AIzaSyBVaPHihkOt3MSXrw5Hf-HjJB7TrOdawlo";
        var queryURL =
            "https://www.googleapis.com/books/v1/volumes?q=isbn:" +
            isbn +
            "&key=" +
            apiKey;
        // Performing GET requests to the Google Books API
        // Searches by ISBN
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(data) {
            console.log(data);
        });
    }

    function isOnShelves() {
        var stockStatus = parseInt($(".on-stock").html());
        console.log(stockStatus);

        if (stockStatus === 0) {
            $("#reserveBook").removeClass("visible");
            $("#reserveBook").addClass("invisible");
            $("#addToWhishList").removeClass("invisible");
            $("#addToWhishList").addClass("visible");
            $(".on-stock").addClass("stock-alert");
        }
    }

    $(".favorite-book").hover(
        function() {
            $(this).addClass("fav-on");
        },
        function() {
            $(this).removeClass("fav-on");
        }
    );

    isOnShelves();

    $(document).on("click", "a.dropdown-item", function() {
        var keyWord = $("#search-input")
            .val()
            .trim();
        populateBook(keyWord);
    });

    $("#action-btn-reserve").on("click", function(event) {
        // console.log("reserve button pressed");
        event.preventDefault();
        // gets the book id of the ice cream and the cutomer name
        var id = $("#isbn").html();
        console.log(id);
        reserveMedia(6, 1);

        // var customer = $(this).parent().closest('.input-group').children('.form-control').val();
        // if (customer === "") {
        //     alert("Please enter your name!");
        //     return;
        // }
    });

    function reserveMedia(mediumId, userId) {
        var newReservation = {
            MediumId: mediumId,
            UserId: userId
        };

        //POST to reservations table
        $.post("/api/reservations/create", newReservation, result => {
            console.log("NEW RESERVATION MADE:");
            console.log(newReservation);
        })
            .then(() => {
                console.log("TO DO: update media table quantities");
                //PUT to media table
            })
            .then(() => {
                console.log("Entering block with $.get");
                console.log("UserID: ", userId);
                $.get(
                    "/api/reservations/media/" + mediumId + "/" + userId,
                    data => {
                        console.log(data);
                        $("#reservation-position").text(
                            `You are number ${data.userPosition} in line`
                        );
                    }
                );
            });
    }

    //Verified the function works using:
    //deleteReservation(4, 1);
    function deleteReservation(mediumId, userId) {
        console.log("Entering fxn deleteReservation");
        //DELETE from reservations table
        $.ajax({
            url: "/api/reservations/" + userId + "/delete/" + mediumId,
            type: "DELETE",
            success: result => {
                console.log("RECORD DELETED");
                console.log(result);
            }
        });

        //PUT to media table
    }

    //Verified the function works using:
    //checkOutMedia(8, 2);
    function checkOutMedia(mediumId, userId) {
        var newCheckout = {
            MediumId: mediumId,
            UserId: userId
        };

        //POST to checkouthistories table
        $.post("/api/checkouthistories/create", newCheckout, result => {
            console.log("NEW CHECKOUT MADE:");
            console.log(newCheckout);
        }).then(() => {
            console.log("TO DO: update media table quantities");
            //PUT to media table
        });
    }
    checkInMedia(8, 2);
    function checkInMedia(mediumId, userId) {
        console.log("Entering fxn checkInMedia");
        var newCheckin = {
            MediumId: mediumId,
            UserId: userId
        };

        //PUT to checkouthistories table
        $.ajax({
            url: "/api/checkouthistories/checkin",
            type: "PUT",
            success: result => {
                console.log("RECORD UPDATED");
                console.log(result);
            }
        });

        //PUT to media table
    }
});
