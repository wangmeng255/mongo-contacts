exports.DATABASE_URL = process.env.DATABASE_URL || 
                       global.DATABASE_URL || 
                       (process.env.NODE_ENV === 'production' ? 
                       'mongodb://admin:admin@ds139985.mlab.com:39985/mongo_data':
                       'mongodb://admin:admin@ds139985.mlab.com:39985/mongo_data');
                       //'mongodb://localhost/contacts' : 
                       //'mongodb://localhost/contacts-dev');
exports.PORT = process.env.PORT || 8080;