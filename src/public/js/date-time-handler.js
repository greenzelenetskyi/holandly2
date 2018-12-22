$(document).ready(function () {
    m = moment();
    currHref = $(location).attr('href');
    serverData = JSON.parse(window.holandlyData);
    var currEvent = window.holandlyPath;
    console.log(serverData);
    fillHeader(serverData.toplevel);
    var currType = findEventByPath(serverData.types, currEvent);
    $('.subheader').find('span').html(m.lang('ru').format('LLLL'));
    fillSubheader(currType);
    buildWrapper(currType);
});

function fillHeader(data) {
    $('title').html(data.title);
    $('.increased.popover-toggle.silent.disabled').html(data.title);
}

function fillSubheader(data) {
    var subheader = $('.subheader');
    subheader.find('.marker').css('background-color', data.color);
    var title = $('<h3>').html(data.title.trim());
    subheader.find('.last-col').append(title);
    setInterval(function () {
        subheader.find('span').html(moment().lang('ru').format('LLLL'));
    }, 30000);
}

function findEventByPath(data, path){
    var result;
    // todo: make this more safely and stable
    $.each(data, function (index, value) {
        if (value.path === path){
            result = value;
        }
    });
    return result;
}

function buildWrapper(data) {
    var parent = $('.date-time-step');
    var wrapper = $('<div>').addClass('wrapper');
    buildIconedText(data, wrapper);
    buildDaysRegion(data, wrapper);
    buildNavBar(moment(m), wrapper);
    parent.append(wrapper);
}

function buildIconedText(data, parent){
    for (var i = 0; i < 2; i++) {
        var expression = i%2 === 0;
        var item = $('<div>').addClass('iconed-text').append($('<i>').addClass(expression ? 'icon-description' : 'icon-location-target'));
        var itemText = $('<div>').addClass('last-col').html(expression ? data.description : data.location);
        item.append(itemText);
        parent.append(item);
    }
}

function buildDaysRegion(data, parent) {
    var daysRegion = $('<div>').addClass('js-days-region mvl');
    var weekView = $('<div>').addClass('week-view').append($('<h2>').addClass('mbl text-center').html('Выберите подходящий день'));
    buildSpinner(weekView);
    buildPeriodRow(data, weekView);
    buildWeeksRegion(weekView);
    daysRegion.append(weekView);
    parent.append(daysRegion);
}

function buildPeriodRow(data, parent) {
    parent.find('.js-spinner').removeClass('hidden');
    var periodRow = $('<div>').addClass('period row');
    var iconLeft = $('<span>').addClass('icon-angle-left disabled').css('visibility', 'visible');
    var iconRight = $('<span>').addClass('icon-angle-right').css('visibility', 'visible');
    var daysBody = $('<div>').addClass('centered js-days-body');
    for (var i = 0; i < 7; i++){
        var _moment = moment(m);
        buildDay(i, _moment, daysBody, data);
    }
    periodRow.append(iconLeft).append(iconRight).append(daysBody);
    parent.find('.js-spinner').addClass('hidden');
    parent.append(periodRow);
}

function buildSpinner(parent){
    var spinner = $('<div>').addClass('js-spinner spinner');
    for (var i = 0; i < 3; i++)
        spinner.append($('<div>').addClass('bounce'+(i+1)));
    parent.append(spinner);
}

// todo: improve 'unavailable' status logic
function buildDay(index, _moment, parent, data) {
    _moment.add(index, 'days');
    var item = $('<div>').addClass('fraction js-day-wrapper');
    var available = checkDayAvailability(data, _moment.day()) ? 'available' : 'unavailable';
    item.addClass(available);
    if (_moment.day() === 0) {
        item.addClass('separator');
        separator = index;
    }
    var today = $('<div>').addClass('today').html('- Сегодня -');
    var day = $('<div>').addClass('day js-show-picker');
    var short = $('<strong>').addClass('shorthand').html(_moment.lang('ru').format('dd'));
    var full = $('<strong>').addClass('full').html(_moment.lang('ru').format('dddd'));
    var todMob = $('<strong>').addClass('today-mobile').html('(Сегодня)');
    var dayDiv = $('<div>').append(short).append(full);
    if (index === 0) {
        dayDiv.append(todMob);
        item.append(today);
    }
    var shortDate = $('<div>').addClass('muted shorthand').html(_moment.lang('ru').format('MMM Do'));
    var fullDate = $('<div>').addClass('full muted').html(_moment.lang('ru').format('LL'));
    var dateDiv = $('<div>').append(shortDate).append(fullDate);
    day.append(dayDiv).append(dateDiv);
    day.append($('<i>').addClass('icon-arrow-right'));
    item.append(day);
    if (available === 'unavailable')
        item.append($('<span>').addClass('status').html('недоступно'));
    parent.append(item);
}

function checkDayAvailability(data, dayOfTheWeek) {
    dayOfTheWeek = dayOfTheWeek > 0 ? (dayOfTheWeek - 1) : 6;
    var daysSetup = data.recurring.weekly.days;
    return (daysSetup[dayOfTheWeek] !== undefined && daysSetup[dayOfTheWeek] !== null);
}

// todo: optimize
function buildWeeksRegion(parent) {
    var weeksRegion = $('<div>').addClass('centered js-weeks-region');
    var lDivision = $('<div>').addClass('division size'+(separator+1)+'of7');
    lDivision.append($('<span>').addClass('label').html('текущ. неделя'));
    var rDivision = $('<div>').addClass('division size'+(6-separator)+'of7');
    rDivision.append($('<span>').addClass('label').html('след. неделя'));
    weeksRegion.append($('<div>').append($('<div>').addClass('scale').append(lDivision).append(rDivision)));
    parent.append(weeksRegion);
}

// todo: optimize
function buildNavBar(_moment, parent) {
    var navBar = $('<div>').addClass('js-navigation-bar mbl pagination row');
    var lNav = $('<strong>').addClass('js-navigate left').css('visibility', 'visible');
    if (_moment.isBefore(moment()))
        lNav.addClass('disabled');
    lNav.append($('<i>').addClass('icon-arrow-left-fill')).append($('<span>').addClass('js-period-start-caption').html('До '+ _moment.lang('ru').format('ll')));
    var rNav = $('<strong>').addClass('js-navigate right').css('visibility', 'visible');
    _moment.add(6, 'days');
    rNav.append($('<span>').addClass('js-period-end-caption').html('После '+ _moment.lang('ru').format('ll'))).append($('<i>').addClass('icon-arrow-right-fill'));
    navBar.append(lNav).append(rNav);
    parent.append(navBar);
}


// moment variable
var m;
var serverData;
var separator;