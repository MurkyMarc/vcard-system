/*jshint esversion: 6 */

$(document).ready(function() {

      // Autocomplete for the firstname
      $("#first-name").autocomplete({
            minLength: 2,
            source: function(request, response) {
                  $.ajax( {
                        url: "/api/contacts",
                        success: function(data) {
                              var n = $.grep(data, function (element, index) {
                                    $('#first-name').on('input', function() {
                                          fn = $(this).val();
                                          return fn;
                                    });
                                    if(element.first_name) {
                                          return element.first_name.match(new RegExp(fn, "i"));
                                    }
                              });
                              response(n);
                        }
                  });
            },
            focus: function(event, ui) {
                  $("#first-name").val(ui.item.first_name);
                  return false;
            },
            select: function(event, ui) {
                  $("#first-name").val(ui.item.first_name);
                  return false;
            }
      }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>").append("<div>" + item.first_name + "</div>").appendTo(ul);
      };

      // Autocomplete for the lastname
      $("#last-name").autocomplete({
            minLength: 2,
            source: function(request, response) {
                  $.ajax( {
                        url: "/api/contacts",
                        success: function(data) {
                              var o = $.grep(data, function (element, index) {
                                    $('#last-name').on('input', function() {
                                          ln = $(this).val();
                                          return ln;
                                    });
                                    if(element.last_name) {
                                          return element.last_name.match(new RegExp(ln, "i"));
                                    }
                              });
                              response(o);
                        }
                  });
            },
            focus: function(event, ui) {
                  $("#last-name").val(ui.item.last_name);
                  return false;
            },
            select: function(event, ui) {
                  $("#last-name").val(ui.item.last_name);
                  return false;
            }
      }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>").append("<div>" + item.last_name + "</div>").appendTo(ul);
      };

      // Autocomplete for the email
      $("#email-address").autocomplete({
            minLength: 2,
            source: function(request, response) {
                  $.ajax( {
                        url: "/api/contacts",
                        success: function(data) {
                              var o = $.grep(data, function (element, index) {
                                    $('#email-address').on('input', function() {
                                          ln = $(this).val();
                                          return ln;
                                    });
                                    if(element.email_address) {
                                          return element.email_address.match(new RegExp(ln, "i"));
                                    }
                              });
                              response(o);
                        }
                  });
            },
            focus: function(event, ui) {
                  $("#email-address").val(ui.item.email_address);
                  return false;
            },
            select: function(event, ui) {
                  $("#email-address").val(ui.item.email_address);
                  return false;
            }
      }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>").append("<div>" + item.email_address + "</div>").appendTo(ul);
      };

      // Autocomplete for the phone number
      $("#phone-number").autocomplete({
            minLength: 2,
            source: function(request, response) {
                  $.ajax( {
                        url: "/api/contacts",
                        success: function(data) {
                              var q = $.grep(data, function (element, index) {
                                    $('#phone-number').on('input', function() {
                                          pn = $(this).val().toString();
                                          console.log(pn);
                                          return pn;
                                    });
                                    if(element.phone_number) {
                                          return element.phone_number.match(new RegExp(pn, "i"));
                                    }
                              });
                              response(q);
                        }
                  });
            },
            focus: function(event, ui) {
                  $("#phone-number").val(ui.item.phone_number);
                  return false;
            },
            select: function(event, ui) {
                  $("#phone-number").val(ui.item.phone_number);
                  return false;
            }
      }).autocomplete("instance")._renderItem = function(ul, item) {
            return $("<li>").append("<div>" + item.phone_number + "</div>").appendTo(ul);
      };
});
