
const jumlah = (a,b) => {
    console.log(a+b);
    
}

const pengurangan = (a,b) => {
    console.log(a-b);
    
}

const obj = {
    nama: 'alvin',
    age: 22
}

console.log('ini dari file dua.js');


module.exports = {
    fungsi: jumlah,
    object: obj
}