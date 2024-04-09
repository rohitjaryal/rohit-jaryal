const sum_to_n_a = function(n) {
    // Recursion
    let sum=n;
    if(n===1){
        return sum;
    }
    return sum+sum_to_n_a(n-1);
};

const  sum_to_n_b = function(n) {
    // Looping in decreasing order
    let sum=0;
    for (let i=n;i>0;i--){
        sum+=i;
    }
    return sum;
};

const  sum_to_n_c = function(n) {
    // Looping in increasing order
    let sum=0;
    for (let i=0;i<=n;i++){
        sum+=i;
    }
    return sum;
};

console.log('Recursion: sum_to_n_a',sum_to_n_a(5));
console.log('Decreasing Order Looping: sum_to_n_b',sum_to_n_b(5));
console.log('Increasing Order Looping:sum_to_n_c',sum_to_n_c(5));