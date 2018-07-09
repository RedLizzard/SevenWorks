if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 
        'mongodb://jason:Kendon2312@ds131711.mlab.com:31711/redlizzard-diary'}
}
else{
    module.exports = {mongoURI: 
        'mongodb://localhost:27017/redlizzard-dev'}
}