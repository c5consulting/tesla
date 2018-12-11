const Schema = require('mongoose').Schema;

const authRequestSchema = new Schema({
    authRequestDate: Date,
    accessToken: String,
    expireDate: Date
});

module.exports = mongoose.model('AuthRequest', authRequestSchema);