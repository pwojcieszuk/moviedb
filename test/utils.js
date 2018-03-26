const testUtils = {
    randomStr: () => Math.random().toString(36).substring(7),
    
    parseMongoDoc: doc => JSON.parse(JSON.stringify(doc, (key, value) => {
        return (key === '_id' | key === '__v' | key === 'createdAt' | key === 'updatedAt') ? undefined : value;
    }))
};

module.exports = testUtils;
