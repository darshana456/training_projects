var date = new Date();
var selectedYear = date.getFullYear();
var selectedMonth = date.getMonth();
var selectedDate = date.getDate();
var monthNames = ["January",	"February",	"March",	"April",	"May",	"June",	"July",	"August",	"September","October","November","December"];
var birthday = {'June': {1: 'Darshana', 30: 'Me'}, 'July': {4: 'Xyz', 18: 'Mnop'}, 'September': {3: 'ABC'}, 'January': {15: 'Pqr', 26: 'kakashi'} };
var startDate;
var endDate;
var flag;

$(document).ready(function(){

    $(previous).click(function() {
      calendar(false, true, false);
    })
    $(next).click(function() {
      calendar(true, false, false);
    })
    $(".div-calendar-col").on("click", function() { alert("Today is birthday of " + $(this).data("birthinfo")); console.log(this)});
    calendar();
});

function calendar(next, previous, isDropDown) {
  if (next) {
    if (selectedMonth < 11) {
      selectedMonth++;
    } else {
      selectedMonth = 0;
      selectedYear++;
    }
  } else if (previous) {
    if (selectedMonth == 0) {
      selectedMonth = 11;
      selectedYear--;
    } else {
      selectedMonth--;
    }
  } else if (isDropDown) {
    selectedYear = $("#year-select").val();
    var month = $("#month-select").val();
    selectedMonth = monthNames.indexOf(month);
  }
  dropdownMonth(selectedMonth);
  dropdownYear(selectedYear);
  var dayCount = monthDaysCount();
  createCalendarBody(dayCount, selectedMonth);
}

function createCalendarBody(dayCount, selectedMonth) {
  var day = 1;
  var currentMonth = date.getMonth(); //selectedMonth
  var birthMonth = birthdayMonth(selectedMonth);
  var birthInfo = birthMonth;
  var dateArr = birthInfo ? Object.keys(birthInfo) : [];
  var personName = birthInfo ? Object.values(birthInfo) : [];
  var birthdayPerson = 0;
  var previousMonthLastDate = new Date(selectedYear, selectedMonth, 0).getDate();
  var firstDateOfSelectedMonth = weekDay(day);
  var nextMonthFirstDate = 1;
  var previousMonthDates = previousMonthLastDate - firstDateOfSelectedMonth + 1;
  var calendarRows = $("<div></div>").addClass("div-calendar-row");
  while (day <= dayCount) {
    for (var i = 0; i < 7; i++) {
      var dateColumn = $("<div></div>").addClass("div-calendar-col");
      if (weekDay(day) == i) {
        if (day <= dayCount) {
          dateColumn.text(day);
          if ((day == selectedDate && selectedMonth == currentMonth)) {
            dateColumn.addClass("current-day");
          } else if (dateArr.indexOf(String(day)) != -1) {
            dateColumn.addClass("birth-day").attr({"data-birthinfo": personName[birthdayPerson]});
            birthdayPerson++;
          } else {
            dateColumn.addClass("regular-day");
          }
          dateColumn.addClass(String(day)).attr({"data-date": day}).click(function() {
            selectDateRange($(this).data("date"));
          });
        } else {
          dateColumn.addClass("another-calendar-days").text(nextMonthFirstDate);
          nextMonthFirstDate++;
          }
        day++;
      } else  {
        dateColumn.addClass("another-calendar-days").text(previousMonthDates);
        previousMonthDates++;
      }
        calendarRows.append(dateColumn);
      }
    }
    $("#calendar-body").html(calendarRows);
}

// Number of days in current month
function monthDaysCount() {
  	var daysCount = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return daysCount;
}

// Get week day for every day in the month 0 to 6.
function weekDay(day) {
  	var dayNum = new Date(selectedYear, selectedMonth, day);
  	return dayNum.getDay();
}

// appendDate month dropdown
function dropdownMonth(selectedMonth) {
  var monthNamesArr = [];
  for (var k = 0; k < monthNames.length; k++) {
    var optionMonth = $("<option></option>");
    if (k == selectedMonth) {
      optionMonth.addClass("month");
      optionMonth.attr("selected", true);
    }
    optionMonth.text(monthNames[k]);
    monthNamesArr.push(optionMonth);
  }
  $("#month-select").html(monthNamesArr);
}

function dropdownYear(selectedYear) {
  var yearArr = [];
  for (var h = 2000; h < 2025; h++) {
    var optionYear = $("<option></option>");
    if (h == selectedYear) {
      optionYear.addClass("year");
      optionYear.attr("selected", true);
    }
    optionYear.text(h);
    yearArr.push(optionYear);
  }
  $("#year-select").html(yearArr);
}

function birthdayMonth(selectedMonth) {
  for (var i = 0; i < Object.keys(birthday).length; i++) {
    var keyMonth = Object.keys(birthday)[i]
    if (keyMonth == monthNames[selectedMonth]) {
      return birthday[keyMonth];
    }
  }
}

function selectDateRange(day) {
  if (!startDate) {
    startDate = day;
  } else if (!endDate) {
    endDate = day;
  }

  if (startDate && endDate) {
    if (startDate > endDate) {
      var temp = startDate;
      startDate = endDate;
      endDate = temp;
    }

    for (var i = startDate; i <= endDate; i++) {
      if (flag) {
        $("." + i).removeClass("selected-date-range");
        if (i == endDate) {
          startDate = null;
          endDate = null;
        }
      } else {
        $("." + i).addClass("selected-date-range");
      }
    }
    flag = !flag;
  }
}
