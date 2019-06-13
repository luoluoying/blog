// for (var i = 0; i < 100000; i++) {
//   var a = {}
// }
var foo = function () {
  var bar = function () {
    var local = '局部变量'
    // return function() {
    //   return local
    // }
    return local
  }
  var baz = bar()
  console.log(baz)
}
foo()