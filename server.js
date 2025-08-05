const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost/namibian_invest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  kycStatus: String,
  isNonResident: Boolean,
});

const User = mongoose.model('User', userSchema);

// Mock KYC API endpoint
app.post('/api/kyc', async (req, res) => {
  const { name, id } = req.body;
  // Simulate KYC verification
  setTimeout(() => {
    res.json({ status: 'verified', message: 'KYC completed' });
  }, 1000);
});

// User login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.json({ user: { name: user.name, isNonResident: user.isNonResident } });
  } else {
    const newUser = new User({ name: 'John Doe', email, kycStatus: 'pending', isNonResident: true });
    await newUser.save();
    res.json({ user: { name: newUser.name, isNonResident: newUser.isNonResident } });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));