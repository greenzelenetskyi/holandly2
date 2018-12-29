$(document).ready(function () {
    currHref = $(location).attr('href');
    serverData = JSON.parse(window.holandlyData);
    fillHeader();
});

function fillHeader() {
    var header = $('<div>').addClass('header');
    header.append($('<div>').addClass('wrapper')
        .append('<h4>').html(/* user title */));
    header.append($('<hr>').addClass('mbl'));
    var wrapper = $('<div>').addClass('wrapper');
    var adaptive_row = $('<div>').addClass('adaptive row');
    adaptive_row.append($('<div>').addClass('col1of2 mbm prm')
        .append($('<div>').addClass('mbs row')
            .append($('<div>').addClass('marker').css('background-color', ''/*todo: insert color*/))
            .append($('<div>').addClass('last-col')
                .append($('<h2>').html('insert meeting name here')))));
    adaptive_row.append($('<div>').addClass('emphasis iconed-text').html('insert event time here')
        .append($('<i>').addClass('icon-clock')));
    adaptive_row.append($('<div>').addClass('col1of2 plm')
        .append($('<h2>').addClass('mbs').html('Отменить событие?'))
        .append($('<div>').addClass('field mbm')
            .append($('<label>').html("Причина отмены"))
            .append($('<textarea>').addClass('js-cancel-reason').attr({'name': 'cancel_reason', 'rows': '3', 'maxLength': '1000'})))
        .append($('<button>').addClass('button js-cancel-event').html('Отменить событие')));
    wrapper.append(adaptive_row);
}

function buildSuccessPage(){
    var mainReg = $('.main-region');
    mainReg.empty();
    var div = $('<div>');
    var header = $('<div>').addClass('header');
    header.append($('<h2>').addClass('pts').html('Отмена события успешна'));
    header.append($('<div>').addClass('mbs phl').html('Ваша встреча с ' + serverData.toplevel.title + ' отменена'));
    div.append(header);
    var narrowerWrapper = $('<div>').addClass('narrower wrapper');
    narrowerWrapper.append($('<hr>').addClass('dotted mbm'));
    var linethrough = $('<div>').addClass('linethrough mbm phm');
    linethrough.append($('<div>').addClass('mbs row')
        .append($('<div>').addClass('marker').css('background-color', currType.color))
        .append($('<div>').addClass('last-col').html(currType.title)));
    linethrough.append($('<div>').addClass('emphasis iconed-text').html(currDaySchedule[picked].format('HH:mm - dddd, MMMM Do, YYYY'))
        .append($('<i>').addClass('icon-clock')));
    linethrough.append($('<hr>').addClass('mbm'));
    narrowerWrapper.append(linethrough);
    div.append(narrowerWrapper);
    mainReg.append(div);
}

$(document).on('click', '.js-cancel-event', function () {
    $.ajax({
        type: 'POST',
        url: '',
        data: JSON.stringify({}),
        dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            buildSuccessPage();
        }
    })
});