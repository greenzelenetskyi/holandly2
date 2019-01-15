$(document).ready(function () {
    firstDay = moment();
    m = moment(firstDay);
    weekArray = [0,0,0,0,0,0,0];
    currHref = $(location).attr('href');
    serverData = JSON.parse(window.holandlyData);
    scheduled_visitors = [];
    formatScheduledVis(window.holandlyEvents, scheduled_visitors);
    var currEvent = window.holandlyPath;
    fillHeader(serverData.toplevel);
    currType = findEventByPath(serverData.types, currEvent);
    getOverrideData(currType.override.exactday);
    lastDay = moment().add(currType.rangeDays, 'days');
    $('.subheader').find('span').html(m.lang('ru').format('LLLL'));
    fillSubheader(currType);
    buildWrapper(currType);
    currPageState = 1;
});

function getOverrideData(currEvntOverride){
    var keys = Object.keys(currEvntOverride);
    var values = Object.values(currEvntOverride);
    for (var i = 0; i < keys.length; i++){
        override.push({day: keys[i], time: values[i]})
    }
}

function formatScheduledVis(data, schedVis) {
    if (data.length === 0)
        return;
    $.each(data, function (index, value) {
        var val = moment(value.date+' '+value.time, 'DD-MM-YYYY HH:mm' );
        schedVis.push(val);
    })
}

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

/** in case if current user has no any event by inserted path - base location is changing to user's full events list, in other case visitor can proceed his work with picked event.
 * @param data user events configuration.
 * @param path current location path user trying to access.
 * @returns {*} event configuration in case if event by current path is exists.
 */
function findEventByPath(data, path){
    var result;
    $.each(data, function (index, value) {
        if (value.path === path){
            result = value;
        }
    });
    if (result !== undefined && result !== null)
        return result;
    else $(location).attr('href', currHref.substring(0, currHref.lastIndexOf('/')));
}

function buildWrapper(data) {
    var parent = $('.date-time-step');
    var wrapper = $('<div>').addClass('wrapper');
    buildIconedText(data, wrapper);
    buildDaysRegion(data, wrapper);
    var navBar = $('<div>').addClass('js-navigation-bar mbl pagination row');
    buildNavBar(moment(m), navBar);
    wrapper.append(navBar);
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
    var weekView = $('<div>').addClass('week-view');
    buildWeekView(data, weekView);
    daysRegion.append(weekView);
    parent.append(daysRegion);
}


function buildWeekView(data, parent) {
    parent.empty();
    parent.append($('<h2>').addClass('mbl text-center').html('Выберите подходящий день'));
    buildPeriodRow(data, parent);
    buildSpinner(parent);
    buildWeeksRegion(parent);
}

function buildPeriodRow(data, parent) {
    var periodRow = $('<div>').addClass('period row');
    var iconLeft = $('<span>').addClass('icon-angle-left').css('visibility', 'visible');
    if (moment(m).subtract(7, 'days').isBefore(firstDay))
        iconLeft.addClass('disabled');
    var iconRight = $('<span>').addClass('icon-angle-right').css('visibility', 'visible');
    var daysBody = $('<div>').addClass('centered js-days-body');
    buildDaysBody(daysBody, data);
    periodRow.append(iconLeft).append(iconRight).append(daysBody);
    parent.append(periodRow);
}

function buildDaysBody(daysBody, data){
    for (var i = 0; i < 7; i++){
        var _moment = moment(m);
        buildDay(i, _moment, daysBody, data);
    }
}

function buildSpinner(parent){
    var spinner = $('<div>').addClass('js-spinner spinner hidden');
    for (var i = 0; i < 3; i++)
        spinner.append($('<div>').addClass('bounce'+(i+1)));
    parent.append(spinner);
}

// todo: improve 'unavailable' status logic
function buildDay(index, _moment, parent, data) {
    _moment.add(index, 'days');
    weekArray[index] = _moment;
    var item = $('<div>').addClass('fraction js-day-wrapper');
    var available = checkDayAvailability(data, _moment) ? 'available' : 'unavailable';
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
    if (_moment.dayOfYear() === moment().dayOfYear()) {
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

function checkDayAvailability(data, _moment) {
    var dayOfTheWeek = _moment.day();
    var _overridedDay = checkOverride(_moment);
    if (_overridedDay !== undefined){
        var result = false;
        if (_overridedDay === null)
            return result;
        result = !isDayScheduled(_overridedDay, _moment);
        return result;
    }
    if (_moment.isAfter(lastDay))
        return false;
    dayOfTheWeek = dayOfTheWeek > 0 ? (dayOfTheWeek - 1) : 6;
    var daysSetup = data.recurring.weekly.days;
    if (daysSetup[dayOfTheWeek] !== undefined && daysSetup[dayOfTheWeek] !== null) {
        if (daysSetup[dayOfTheWeek].reuse !== undefined){
            return !isDayScheduled(daysSetup[daysSetup[dayOfTheWeek].reuse], _moment)
        }
        return !isDayScheduled(daysSetup[dayOfTheWeek], _moment);
    }
    return false;
}

function checkOverride(_moment) {
    for (var i = 0; i < override.length; i++){
        var item = override[i];
        if (_moment.dayOfYear() === moment(item.day, 'YYYY.MM.DD').dayOfYear()){
            var value = Object.keys(item.time);
            if(value[0] === 'slots'){
                if(item.time.slots.length === 0){
                    return null;
                }
                else {
                    return {day: moment(_moment), slots: item.time.slots};
                }
            }
            else if (value[0] === 'reuse'){
                return checkOverride(moment(item.time.reuse, 'YYYY.MM.DD'));
            }
        }
    }
}

function isDayScheduled(daySetup, _moment){
    var currDay = moment(_moment);
    var slots = daySetup.slots;
    var schedVisNum = 0;
    for (var i = 0; i < slots.length; i++){
        var item = slots[i].time;
        currDay.hours(item.slice(0, 2));
        currDay.minutes(item.slice(-2));
        currDay.seconds(0);
        if(moment(currDay.format()).isAfter(moment().format())){
            scheduled_visitors.forEach(function (value, i, scheduled_visitors) {
                if (moment(value.format()).isSame(moment(currDay.format()))){
                    schedVisNum++;
                }
            })
        } else {
            schedVisNum += currType.concurrentVisitors;
        }
    }
    return schedVisNum >= (slots.length * currType.concurrentVisitors);
}

function buildWeeksRegion(parent) {
    var weeksRegion = $('<div>').addClass('centered js-weeks-region');
    var lDivision = $('<div>').addClass('division size'+(separator+1)+'of7');
    lDivision.append($('<span>').addClass('label').html(weeksRegionCounter < 2 ? weeksRegionModal[weeksRegionCounter] : weeksRegionCounter + weeksRegionModal[2]));
    var rDivision = $('<div>').addClass((6-separator) !== 0 ? 'division size'+(6-separator)+'of7' : "");
    if (rDivision.hasClass('division')) {
        rDivision.append($('<span>').addClass('label').html((weeksRegionCounter+1) < 2 ? weeksRegionModal[weeksRegionCounter+1] : (1+weeksRegionCounter) + weeksRegionModal[2]));
    }
    weeksRegion.append($('<div>').append($('<div>').addClass('scale')
        .append(lDivision)
        .append(rDivision)));
    parent.append(weeksRegion);
}

function buildNavBar(_moment, parent) {
    parent.empty();
    var lNav = $('<strong>').addClass('js-navigate left').css('visibility', 'visible');
    if (_moment.isBefore(moment()))
        lNav.addClass('disabled');
    lNav.append($('<i>').addClass('icon-arrow-left-fill')).append($('<span>').addClass('js-period-start-caption').html('До '+ _moment.lang('ru').format('ll')));
    var rNav = $('<strong>').addClass('js-navigate right').css('visibility', 'visible');
    _moment.add(6, 'days');
    rNav.append($('<span>').addClass('js-period-end-caption').html('После '+ _moment.lang('ru').format('ll'))).append($('<i>').addClass('icon-arrow-right-fill'));
    parent.append(lNav).append(rNav);
}


function buildTimePicker(_moment, data) {
    currPageState = 2;
    var parent = $('.main-region#main-region');
    parent.empty();
    var mainDiv = $('<div>');
    parent.append(mainDiv);
    var header = $('<div>').addClass('header');
    var wrapper = $('<div>').addClass('wrapper').append($('<div>').addClass('icon-arrow-left js-step-back step-back'));
    wrapper.append($('<h2>').html(_moment.format('dddd')));
    wrapper.append($('<div>').addClass('mbm').html(_moment.format('LL')));
    wrapper.append($('<div>').addClass('mbl').html(_moment.timeZoneName));
    header.append(wrapper);
    mainDiv.append(header);
    mainDiv.append($('<hr>').addClass('mbl'));
    var narrow_wrapper = $('<div>').addClass('narrow wrapper');
    narrow_wrapper.append($('<div>').addClass('mbm text-center'));
    narrow_wrapper.append($('<div>').addClass('adaptive mbs row')
        .append($('<div>').addClass('col3of5 mbs mobile-centered'))
        .append(($('<h2>').html("Выберите время"))));
    var spotList = $('<div>').addClass('js-am-spot-list');
    buildTimeline(spotList, _moment);
    narrow_wrapper.append(spotList);
    mainDiv.append(narrow_wrapper);
}

function buildTimeline(parent, _moment) {
    var _overridedDay = checkOverride(_moment);
    var dayOfTheWeek = _moment.day();
    dayOfTheWeek = dayOfTheWeek > 0 ? (dayOfTheWeek - 1) : 6;
    var table = $('<ul>').addClass('spots');
    var data = currType.recurring.weekly;
    var spots = _overridedDay !== undefined ? _overridedDay : data.days[dayOfTheWeek];
    if (spots.slots !== undefined){
        timelineTable(_moment, spots.slots, table);
    }
    else{
        timelineTable(_moment, data.days[spots.reuse].slots, table);
    }
    parent.append(table);
}


// todo: optimization needed
function timelineTable(_moment, data, table) {
    for (var i = 0; i < data.length; i++) {
        var value = data[i];
        var thisMoment = moment(_moment);
        thisMoment.set('hour',  +value.time.substring(0, value.time.indexOf(':')));
        thisMoment.set('minute',  +value.time.slice(-2));
        thisMoment.set('second', 0);
        if (checkScheduledUsers(thisMoment)) {
            currDaySchedule.push(thisMoment);
            var item = $("<li>").addClass("spot available collapsed");
            item.append($('<button>').addClass('button js-select time-button').html(value.time).append($('<div>').addClass('status').html('available')));
            item.append($('<button>').addClass('base button confirm-button js-confirm').html('Выбрать'));
            table.append(item);
        }
    }
}

function checkScheduledUsers(_momentData){
    var concurrentVis = 0;
    for (var i = 0; i < scheduled_visitors.length; i++){
        if (moment(_momentData.format()).isSame(scheduled_visitors[i].format())) {
            concurrentVis++;
        }
    }
    return moment(_momentData.format()).isAfter(moment().format()) && (concurrentVis !== currType.concurrentVisitors);
}

function buildPickerHeader(parent){
    var head_wrapper = $('<div>').addClass('wrapper');
    head_wrapper.append($('<div>').addClass('icon-arrow-left js-step-back step-back'));
    head_wrapper.append($('<div>').addClass('title-wrapper'))
        .append($('<div>').append($('<img>').addClass('avatar js-avatar mbs clickable').attr('src', '/img/shppLogo.png')))
        .append($('<div>').addClass('mbs phs popover-holder').append($("<div>").addClass('increased popover-toggle silent disabled').html(serverData.toplevel.title)));
    parent.append($('<div>').addClass('header')
        .append($('<div>').addClass('js-profile-region').append(head_wrapper)));
    parent.append($('<hr>').addClass('mbl'));
}

function buildPickerWrapper(parent){
    var wrapper = $('<div>').addClass('wrapper');
    var enterDetails = $('<div>').addClass('adaptive enter-details row');
    var leftCol = $('<div>').addClass('col1of2 prm');
    leftCol.append($('<div>').addClass('mbs row')
        .append($('<div>').addClass('marker').css('background-color', currType.color))
        .append($('<div>').addClass('last-col').append($('<h2>').html(currType.title))));
    leftCol.append($('<div>').addClass('emphasis iconed-text').html(currDaySchedule[picked].format('HH:mm - dddd, MMMM Do, YYYY'))
        .append($('<i>').addClass('icon-clock')));
    leftCol.append($('<div>').addClass('iconed-text')
        .append($('<i>').addClass('icon-description'))
        .append($('<div>').addClass('last-col').html(currType.description)));
    leftCol.append($('<div>').addClass('iconed-text')
        .append($('<i>').addClass('icon-location-target'))
        .append($('<div>').addClass('last-col').html(currType.location)));
    enterDetails.append(leftCol);
    var rightCol = $('<div>').addClass('col1of2 plm');
    rightCol.append($('<div>').addClass('hidden-tablet-up'));
    rightCol.append($('<h2>').addClass('mbm').html("Введите ваши данные"));
    buildApplicationForm(rightCol);
    enterDetails.append(rightCol);
    wrapper.append(enterDetails);
    parent.append(wrapper);
}

function buildApplicationForm(parent){
    currPageState = 2;
    var form = $('<form>').addClass('js-form');
    form.append($('<div>').addClass('js-base-questions-region')
        .append($('<div>')
            .append($('<div>').addClass('field js-input-container mbm')
                .append($('<label>').html(currType.form.fields[0].label + " *"))
                .append($('<input>').addClass('js-input text').attr({'type': currType.form.fields[0].type, 'id': 'name'}))
                .append($('<span>').attr({'data-error': 'full-name', 'id': "error-name"})))
            .append($('<div>').addClass('field js-input-container mbm')
                .append($('<label>').html(currType.form.fields[1].label + " *"))
                .append($('<input>').addClass('js-input text').attr({'type': currType.form.fields[1].type, 'id': 'email'}))
                .append($('<span>').attr({'data-error': 'email', 'id': "error-email"})))));
    form.append($('<div>').addClass("ptm")
        .append($('<input>').addClass('button js-apply-schedule').attr({'type': 'submit', 'value': 'Спланировать'})));
    parent.append(form);
    formListener(form);
}

function buildSuccessPage(){
    var mainReg = $('.main-region');
    mainReg.empty();
    var div = $('<div>');
    var header = $('<div>').addClass('header');
    header.append($('<h2>').addClass('pts').html('Успешно'));
    header.append($('<div>').addClass('mbs phl').html('Вы записались в ' + serverData.toplevel.title));
    div.append(header);
    var narrowerWrapper = $('<div>').addClass('narrower wrapper');
    narrowerWrapper.append($('<hr>').addClass('dotted mbm'));
    narrowerWrapper.append($('<div>').addClass('mbs row')
        .append($('<div>').addClass('marker').css('background-color', currType.color))
        .append($('<div>').addClass('last-col').html(currType.title)));
    narrowerWrapper.append($('<div>').addClass('emphasis iconed-text').html(currDaySchedule[picked].format('HH:mm - dddd, MMMM Do, YYYY'))
        .append($('<i>').addClass('icon-clock')));
    narrowerWrapper.append($('<div>').addClass('iconed-text')
        .append($('<i>').addClass('icon-description'))
        .append($('<div>').addClass('last-col').html(currType.description)));
    narrowerWrapper.append($('<div>').addClass('iconed-text')
        .append($('<i>').addClass('icon-location-target'))
        .append($('<div>').addClass('last-col').html(currType.location)));
    narrowerWrapper.append($('<div>').addClass('text-center')
        .append($('<strong>'))
        .append($('<div>').addClass('pvl')
            .append($('<strong>').html('Приглашение было выслано на ваш почтовый ящик.')))
        .append($('<hr>').addClass('dotted mbl')));
    div.append(narrowerWrapper);
    mainReg.append(div);
}

// listeners

$(document).on('click','.js-step-back', function () {
    if (currPageState !== 1){
        $(location).attr('href', currHref);
    }
    else {
        $(location).attr('href', currHref.substr(0, currHref.lastIndexOf('/')));
    }
});

$(document).on('click', '.js-day-wrapper', function () {
    if ($(this).hasClass('unavailable'))
        return;
    var index = $(this).index();
    currDaySchedule = [];
    buildTimePicker(weekArray[index], currType);
});

$(document).on('click', '.icon-angle-right, .js-navigate.right', function () {
    var parent = $('.week-view');
    m.add(7, 'days');
    weeksRegionCounter++;
    buildWeekView(currType, parent);
    buildNavBar(moment(m), $('.js-navigation-bar'));
});

$(document).on('click', '.icon-angle-left, .js-navigate.left', function () {
    var parent = $('.week-view');
    if ($(this).hasClass('disabled'))
        return;
    m.subtract(7, 'days');
    weeksRegionCounter--;
    buildWeekView(currType, parent);
    buildNavBar(moment(m), $('.js-navigation-bar'));
});

$(document).on('click', '.spots li', function () {
    $('li').each(function (){
        $(this).removeClass('selected');
    });
    picked = $(this).index();
    $(this).addClass('selected');
});

$(document).on('click', '.js-confirm', function () {
    var main_region = $('.main-region#main-region');
    main_region.empty();
    var solo = $('<div>').addClass('solo');
    buildPickerHeader(solo);
    buildPickerWrapper(solo);
    main_region.append(solo);
});

function formListener(form) {
    form.on("submit", function (event) {
        event.preventDefault();
        clearErrors();
        var name = $('#name').val();
        var email = $('#email').val();
        var namePattern = new RegExp(currType.form.fields[0].regex, 'g');
        var nameError = !(namePattern.test(name) && name.length >= currType.form.fields[0].minLen);
        var mailPattern = new RegExp(currType.form.fields[1].regex, 'g');
        var mailError = !(mailPattern.test(email));
        if (!nameError && !mailError)
            sendData({name: name, email: email});
        if (nameError) {
            $('#error-name').addClass('error-message').html('Неверный формат имени и фамилии.');
            $('#error-name').parent().addClass('contains-error');
        }
        if (mailError) {
            $('#error-email').addClass('error-message').html('Неверный формат почты.');
            $('#error-email').parent().addClass('contains-error');
        }
    });
}

function clearErrors(){
    $('#error-name').removeClass('error-message').empty();
    $('#error-name').parent().removeClass('contains-error');
    $('#error-email').removeClass('error-message').empty();
    $('#error-email').parent().removeClass('contains-error');
}

function sendData(inputData){
    var outputJson = {title: currType.title, location: currType.location, description: currType.description,
        canCancel: currType.canCancel, cancellationPolicy: currType.cancellationPolicy};
    $.ajax({
        type: 'POST',
        url: '/sign',
        data: JSON.stringify({type: currType.path, date: currDaySchedule[picked].format('DD-MM-YYYY'), time: currDaySchedule[picked].format('HH:mm'),
            name: inputData.name, email: inputData.email, userName: window.holandlyUser, enableWebHook: currType.enableWebHook, event_data: outputJson,
            userTitle: serverData.toplevel.title}),
        // dataType: 'json',
        contentType: "application/json",
        success: function (data) {
            buildSuccessPage();
        }
    })
}

// moment variable
var m, firstDay, lastDay;
var serverData;
var separator;
var currPageState;
var currType;
var weekArray;
var scheduled_visitors;
var currDaySchedule;
var picked;
var weeksRegionModal = ['текущ. неделя', 'след. неделя', ' нед. спустя'];
var weeksRegionCounter = 0;
var override = [];