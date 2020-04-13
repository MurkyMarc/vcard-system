/* jshint esversion: 6 */

const home_dir = "http://localhost:80/api/contacts";
const twiml_url = "http://localhost:80/twiml";

const ajaxGET = {
      type: "GET",
      contentType: 'application/json; charset=utf-8'
};
const ajaxPOST = {
      type: "POST",
      contentType: 'application/json; charset=utf-8'
};
const ajaxPUT = {
      type: "PUT",
      contentType: 'application/json; charset=utf-8'
};
const ajaxDELETE = {
      type: "DELETE",
      contentType: 'application/json; charset=utf-8'
};

function toggleMsg() {
      $('#custom-msg-box').toggle();
}

// adding data to the database
// NOT BEING USED
function submitForm() {
      let formdata = $('#add_contact').serialize();
      $.ajax({url: home_dir, type: 'POST', data: formdata});
      $('input[type="text"]').val('');
};

// sends the message and resets the fields
function sendTwiml() {
      let textdata = $('#send-twiml').serialize();

      // console.log(textdata);
      // do the id assignment and checks here

      $.ajax({url: twiml_url, type: 'GET', data: textdata});
      $.ajax({url: home_dir, type: 'POST', data: textdata});
      $('#send-twiml')[0].reset();
};

function addRow() {
      $.ajax({url: home_dir, type: 'POST'});
      $("#example-table").tabulator("setData", home_dir, {}, ajaxGET);
};

$(document).ready(function() {

      $('#custom-msg-box').hide();

      const updateIcon = function(cell, formatterParams) {
            return "<span class='upd'>&#8634;</span>";
      };

      const formatDate = function(cell, formatterParams) {
            let date = new Date(cell.getValue());
            let new_date = moment(date).format("MM-DD-YYYY");
            return new_date;
      };

      $("#example-table").tabulator({

            initialSort: [
                  {
                        column: "date_entered",
                        dir: "desc"
                  }
            ],
            pagination:"local",
            layout: "fitDataFill",
            paginationSize:27,


            columns: [
                  {
                        title: "First Name",
                        field: "first_name",
                        sorter: "string",
                        editor: "input",
                        headerFilter: "input",
                        headerFilterPlaceholder: "search"
                  }, {
                        title: "Last Name",
                        field: "last_name",
                        sorter: "string",
                        editor: "input",
                        headerFilter: "input",
                        headerFilterPlaceholder: "search"
                  }, {
                        title: "Phone",
                        field: "phone_number",
                        align: "center",
                        sorter: "string",
                        editor: "input",
                        headerFilter: "input",
                        headerFilterPlaceholder: "search"
                  }, {
                        title: "Email",
                        field: "email_address",
                        sorter: "alphanum",
                        editor: "input",
                        headerFilter: "input",
                        headerFilterPlaceholder: "search"
                  }, {
                        title: "Location",
                        field: "location",
                        align: "center",
                        editor: "select",
                        editorParams: {
                              "Location 1": "Location 1",
                              "Location 2": "Location 2",
                              "Location 3": "Location 3"
                        },
                        headerFilter: true,
                        headerFilterParams: {
                              "location1": "Location1",
                              "location2": "Location2",
                              "": "All"
                        }
                  }, {
                        title: "Date Entered",
                        field: "date_entered",
                        align: "center",
                        formatter: formatDate,
                        cellClick: function(e, cell) {
                              // console.log(cell.getData());
                        },
                        headerFilter: "input",
                        headerFilterPlaceholder: "search"
                  }, {
                        title: "Save",
                        field: "_id",
                        align: "center",
                        formatter: updateIcon,
                        cellClick: function(e, cell) {
                              var d = cell.getRow().getData();
                              $.ajax({
                                    url: home_dir + "/" + cell.getValue(),
                                    type: 'PUT',
                                    data: d,
                                    success: function(result) {
                                          // console.log("update worked");
                                    }
                              });
                              $("#example-table").tabulator("setData", home_dir, {}, ajaxGET);
                        }
                  }, {
                        title: "Delete",
                        field: "_id",
                        align: "center",
                        formatter: "buttonCross",
                        cellClick: function(e, cell) {
                              $.ajax({
                                    url: home_dir + "/" + cell.getValue(),
                                    type: 'DELETE',
                                    success: function(result) {
                                          // console.log("it worked");
                                    }
                              });
                              cell.getRow().delete();
                        }
                  }
            ]
      });

      //Auto load data into the table
      $("#example-table").tabulator("setData", home_dir, {}, ajaxGET);

      $("#example-table").tabulator({
            ajaxURL: home_dir,
            ajaxProgressiveLoad:"scroll",
      });

      //Refresh Button
      $("#ajax-trigger").click(function() {
            $("#example-table").tabulator("setData", home_dir, {}, ajaxGET);
      });

      //trigger download of data.csv file
      $("#download-csv").click(function() {
            $("#example-table").tabulator("download", "json", "data.json");
      });
});
