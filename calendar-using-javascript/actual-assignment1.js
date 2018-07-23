var date = new Date();
var selectedYear = date.getFullYear();
var selectedMonth = date.getMonth();
var selectedDate = date.getDate();
var monthNames = ["January",	"February",	"March",	"April",	"May",	"June",	"July",	"August",	"September","October","November","December"];
var birthday = {'June': {1: 'Darshana', 12: 'Me'}, 'July': {4: 'Xyz', 8: 'Mnop'}, 'September': {3: 'ABC'}, 'January': {15: 'Pqr', 26: 'kakashi'} };
var pr = Object.keys(birthday)[0];

calendar();

function calendar(next, previous, isDropDown){
  console.log(pr);
  if (next) {
    if (selectedMonth < 11) {
      selectedMonth++;
    }
    else {
      selectedMonth = 0;
      selectedYear++;
    }
  }
  else if (previous) {
    if (selectedMonth == 0) {
      selectedMonth = 11;
      selectedYear--;
    }
    else {
      selectedMonth--;
    }
  }
  else {
    if (isDropDown) {
      selectedYear = document.getElementById("year-select").value;
      var month = document.getElementById("month-select").value;
      selectedMonth = monthNames.indexOf(month);
    } else {
      selectedMonth = 0;
    }
  }

  var dropdownMonth1 = dropdownMonth(selectedMonth);
  var monthSelect = document.getElementById("month-select");
  monthSelect.innerHTML = dropdownMonth1;

  var dropdownYear1 = dropdownYear(selectedYear);
  var yearSelect = document.getElementById("year-select");
  yearSelect.innerHTML = dropdownYear1;

  var tbody = document.getElementById("tb");
  var dayCount = monthDaysCount();
  var weekRow = '';

  var weekRow1 = createCalendarBody(dayCount, weekRow, selectedMonth);
  if (weekRow1) {
    console.log(weekRow1);
    tbody.innerHTML = weekRow1;
  }
}

  function createCalendarBody(dayCount, weekRow, selectedMonth) {
    var day = 1;
    var weekRow = '';
    var currentMonth = date.getMonth(); //selectedMonth
    var birthMonth = birthdayMonth(selectedMonth);
    var birthInfo = birthMonth;
    var dateArr = birthInfo ? Object.keys(birthInfo) : [];
    var personName = birthInfo ? Object.values(birthInfo) : [];
    var birthPerson=0;
    var previousMonthLastDate = new Date(selectedYear, selectedMonth, 0).getDate();
    var firstDateOfSelectedMonth = weekDay(day);
    var nextMonthDate = 1;
    var previousMonthDates = previousMonthLastDate - firstDateOfSelectedMonth + 1;

    while (day <= dayCount) {
      weekRow += "<tr>";
      for (var i = 0; i < 7; i++) {
        if (weekDay(day) == i) {
          if(day <= dayCount) {
            if((day == selectedDate && selectedMonth == currentMonth) || (dateArr.indexOf(String(day)) != -1)) {
              if((day == selectedDate && selectedMonth == currentMonth)) {
              weekRow += '<td id="'+day+'" class="week-table-current">' + day + '</td>';
              }
              else {
              weekRow += '<td class="week-table" id="'+ day +'" onclick="selectDateRange(day)"> <img src="Blue_point.png" width="20px" align="left">' + day + '<div id="birthday-person">' + personName[birthPerson] + '</div></td>';
              birthPerson++;
              }
            }
            else {
              weekRow += '<td class="week-table" id="'+ day +'" onclick="selectDateRange(day)>' + day + '</td>';
            }
          } else {
            weekRow += '<td class="another-calendar-days">' + nextMonthDate + '</td>';
            nextMonthDate++;
            }
          day++;
        } else  {
          weekRow += '<td class="another-calendar-days">'+ previousMonthDates +'</td>'
          previousMonthDates++;
          }
        }
      weekRow += '</tr>';
      }
      return weekRow;
  }

  // Number of days in current month
  function monthDaysCount() {
    	var daysCount = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      return daysCount;
  }
  // Get week day for every day in the month 0 to 6.
  function weekDay(d) {
    	var dayNum = new Date(selectedYear, selectedMonth, d);
    	return dayNum.getDay();
  }
  // appendDate month dropdown
  function dropdownMonth(selectedMonth) {
      var optionMonth = '';
      for(var k = 0; k < monthNames.length; k++)
      {
        optionMonth += '<option value="' + monthNames[k] + '"';
        if(k == selectedMonth) {
          optionMonth += 'id="month" selected';
        }
        optionMonth += '>' + monthNames[k] + '</option>';

      }
     return optionMonth;
  }

  function dropdownYear(selectedYear) {
      var optionYear = '';
      if (optionYear) {
        console.log("true");
      }
      //  - 20 years selectedYear + 20 years
      for(var h = 2000; h < 2025; h++) {
        optionYear += '<option value="' + h + '"';
        if(h == selectedYear) {
          optionYear += 'id="year" selected';
        }
        optionYear += '>' + h + '</option>';
      }
     return optionYear;
  }

  function birthdayMonth(selectedMonth) {
    for (var i = 0; i < Object.keys(birthday).length; i++)
    { var keyMonth = Object.keys(birthday)[i]
      if(keyMonth == monthNames[selectedMonth])
      {
        return birthday[keyMonth];
      }
    }
  }
