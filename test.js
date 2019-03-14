var a = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
var arrays = [], size = 3;

while (a.length > 0)
    arrays.push(a.splice(0, size));

console.log(arrays);