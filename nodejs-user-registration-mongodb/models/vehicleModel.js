const Schema = require('mongoose').Schema;

const vehicleSchema = new Schema({
    'vehicle_id': String,
    'vin': String,
    'display_name': String,
    'option_codes': String,
    'color': String,
    'tokens': [],
    'state': String,
    'in_service': Boolean,
    'id_s': String,
    'calendar_enabled': Boolean,
    'api_version': Number,
    'backseat_token': String,
    'backseat_token_updated_at': String
});

module.exports = mongoose.model('Vehicle', vehicleSchema);