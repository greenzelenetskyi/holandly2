$(document).ready(function () {
    currHref = $(location).attr('href');
    serverData = JSON.parse(window.holandlyData);
    console.log(serverData);
    console.log(serverData.toplevel.title);
    fillHeader(serverData.toplevel);
    fillEvents(serverData.types);
});

function fillHeader(data) {
    $('title').html(data.title);
    $('.increased.popover-toggle.silent.disabled').html(data.title);
    $('.header').find('.muted').html(data.description);
}

function fillEvents(data){
    var parent = $('.row');
    $.each(data, function (index, value) {
        if (value.enabled) {
            var cell = $('<div>').addClass('cell');
            var event = $('<div>').addClass('event-type js-book-button');
            var marker = $('<div>').addClass('marker').css("background-color", value.color);
            var lastCol = $('<div>').addClass('last-col');
            var eventTitle = $('<h3>').html(value.title);
            var description = $('<div>').addClass('muted').html(value.description);
            marker.append(lastCol);
            event.append(marker).append(eventTitle).append(description);
            cell.append(event);
            parent.append(cell);
            cell.attr("href", currHref + '/' + value.path);
        }
    });
}

$('.row').on('click', '.cell',  function () {
    $(location).attr('href', $(this).attr("href"));
});

var currHref;
var serverData;