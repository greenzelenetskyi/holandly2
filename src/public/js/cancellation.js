$(document).ready(function () {
    var currHref = $(location).attr('href');
    serverData = window.holandlyData;
    fillHeader(serverData);
});

function fillHeader(data) {
    var evData = JSON.parse(data.event_data);
    var header = $('<div>').addClass('header');
    var wrapper1 = $('<div>').addClass('wrapper');
    var titleWrapper = $('<div>').addClass('title-wrapper');
    titleWrapper.append($('<div>')
        .append($('<img>').addClass('avatar js-avatar mbs clickable').attr('src', '/img/shppLogo.png')));
    wrapper1.append(titleWrapper);
    wrapper1.append($('<div>').addClass('mbs phs popover-holder')
        .append($('<div>').addClass('increased popover-toggle silent disabled').html(data.title)));
    header.append(wrapper1);
    header.append($('<hr>').addClass('mbl'));
    var wrapper = $('<div>').addClass('wrapper');
    var adaptive_row = $('<div>').addClass('adaptive row');
    adaptive_row.append($('<div>').addClass('col1of2 mbm prm')
        .append($('<div>').addClass('mbs row')
            .append($('<div>').addClass('marker').css('background-color', '#dadada'))
            .append($('<div>').addClass('last-col')
                .append($('<h2>').html(evData.title))))
        .append($('<div>').addClass('emphasis iconed-text').html(moment((serverData.date + ' ' + serverData.time), 'DD-MM-YYYY HH:mm')
            .format('HH:mm - dddd, MMMM Do, YYYY'))
            .append($('<i>').addClass('icon-clock'))));
    adaptive_row.append($('<div>').addClass('col1of2 plm')
        .append($('<h2>').addClass('mbs').html('Отменить событие?'))
        .append($('<div>').addClass('field mbm')
            .append($('<label>').html("Причина отмены"))
            .append($('<textarea>').addClass('js-cancel-reason').attr({'name': 'cancel_reason', 'rows': '3', 'maxLength': '1000'})))
        .append($('<button>').addClass('button js-cancel-event').html('Отменить событие')));
    wrapper.append(adaptive_row);
    $('.main-region').append(header).append(wrapper);
}

function buildSuccessPage(){
    var evData = JSON.parse(serverData.event_data);
    var mainReg = $('.main-region');
    mainReg.empty();
    var div = $('<div>');
    var header = $('<div>').addClass('header');
    header.append($('<h2>').addClass('pts').html('Отмена события успешна'));
    header.append($('<div>').addClass('mbs phl').html('Ваша встреча с ' + serverData.title + ' отменена'));
    div.append(header);
    var narrowerWrapper = $('<div>').addClass('narrower wrapper');
    narrowerWrapper.append($('<hr>').addClass('dotted mbm'));
    var linethrough = $('<div>').addClass('linethrough mbm phm');
    linethrough.append($('<div>').addClass('mbs row')
        .append($('<div>').addClass('marker').css('background-color', '#dadada'))
        .append($('<div>').addClass('last-col').html(evData.title)));
    linethrough.append($('<div>').addClass('emphasis iconed-text').html((moment((serverData.date + ' ' + serverData.time), 'DD-MM-YYYY HH:mm')
        .format('HH:mm - dddd, MMMM Do, YYYY')))
        .append($('<i>').addClass('icon-clock')));
    linethrough.append($('<hr>').addClass('mbm'));
    narrowerWrapper.append(linethrough);
    div.append(narrowerWrapper);
    mainReg.append(div);
}

$(document).on('click', '.js-cancel-event', function () {
    $.ajax({
        type: 'POST',
        url: '/cancel',
        data: JSON.stringify({type: serverData.type, eventid: serverData.eventid, userid: serverData.userid, date: serverData.date,
            time: serverData.time, userTitle: serverData.title}),
        contentType: "application/json",
        success: function (data) {
            buildSuccessPage();
        }
    })
});

var serverData;