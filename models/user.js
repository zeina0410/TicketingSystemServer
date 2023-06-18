const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  phone :{
    type:String,
    required:[true,'Phone number not added'],
    unique:[true, 'Duplicate phone number'],
    minlength:[10,'Minimum phone number length is 10 characters'],
    maxlength:[10,'Maximum phone number length is 10 characters'],
    validate: {
      validator: v=> {
        return /^09[3-9][0-9]+$/.test(v);
      },
      message: 'Invalid phone number.'
    }
  },
  password: {
    type: String,
    required: [true, 'Password not added'],
    minlength: [8, 'Minimum password length is 8 characters'],
    validate: {
      validator: v=> {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
      },
      message: 'Invalid password, must contain uppercase and lowercase letters, numbers and special symbols.'
    }
  },
  name:{
    type:String,
    required:[true,'Name not added'],
    minlength:[3, 'Minimum name length is 3 characters'],
    maxlength:[16,'Maximum name length is 16 characters'],
  },
  role :{
    type:String,
    required:[true,'Role not added'],
    enum: ['Customer', 'Manager', 'Technician']
  },
  region:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Region',
  },
  street :String,
  building : String,
  floor :String,
  flat :String,
});

///////////////////////////////////////////////// Password Hashing //////////////////////////////////////////////
userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

///////////////////////////////////////////////// Login Method /////////////////////////////////////////////////
userSchema.statics.logIn = async function(phone, password) {
  const user = await this.findOne({ phone });
  if(user){
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
      return user;
    }
    throw Error("Incorrect password.");
  }
  throw Error("Incorrect phone number.");
};

module.exports = mongoose.model('User', userSchema);