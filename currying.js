// function f(a){
//     return function (b){
//         console.log(a,b);
//     }
// }

// f(5)(6);

// function sum(a){
//     return function(b){
//         return function(c){
//             return a+b+c;
//                 }
//     }
// }

// console.log(sum(2)(7)(7));

setTimeout(() => console.log("b"), 5000);
setTimeout(() => console.log("a"), 0);
setTimeout(() => console.log("i"));
console.log("yo");

// with 0 delay ,it will happen as quick as possible better than with nothing 

// debounce

function fun() {
    return console.log('avinash');
}

function debounce(fun, delay) {
    let timeout = null;
    return ()=> {
        if (timeout) clearTimeout(timeout)
        timeout =  setTimeout(() => {
                fun();
            }, delay)
    }

}
debounce(fun,500)();

// console.log(a);
// console.log(b);
// var a = b =5 ;

