//jshint esversion:6

// Add this for each function
// Each module is points towards a the function that shares the same name.

exports.getDate = function() {
  
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return today.toLocaleDateString("en-US", options);
}
