const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
let mname = month[d.getMonth()];
let yname = d.getFullYear();
console.log(mname+" "+yname);
$(function() {
  $("#dashtit").html("<h1>Transaction details for : "+mname+"\t"+yname+" </h1>");
});





