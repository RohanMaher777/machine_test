const db = require("../../config/connection");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = db.User;
const OverlayText = db.overlayText; 
const Image = db.image
const access_secret_key = process.env.ACCESS_TOKEN_SECRET


// Controller for registration
async function register(req, res) {
  try {
    const { username, password ,email } = req.body;

    const isEmptykey = Object.keys(req.body).some((key) => {
      const value = req.body[key];
      return value === "" || value === null || value === undefined;
    });
    if (isEmptykey) {
      return res.status(400).json({ error: "please do not give empty fileds" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
       username:username,
       email :email,
       password: hashedPassword 
      });

   return res.status(200).json({
    status : true,
     message: 'User registered successfully',
     data: user 
    });

  } catch (error) {
    console.error(error);
   return res.status(500).json({ 
    status : false,
    message: 'Internal Server Error' });
  }
}


// Controller for login 
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email :email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ UserId: user.id }, 'secretkey', { expiresIn: '1h' });
    res.cookie("token", token, { httpOnly: true })
   return res.status(200).json({ status : true, message: 'Login successful', token });
  } catch (error) {
    console.error(error);
   return res.status(500).json({status : false, message: 'Internal Server Error' });
  }
}


// Controller for generating image and storing in database
const generateImages = async (req, res) => {
  try {
   
    const auth_header = req.headers['authorization']

    if (!auth_header) {
        return res.status(401).json({ message: 'Authorization header missing' })
    }
    const token = auth_header.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Bearer token missing' });
    }
    const decode_Token = jwt.verify(token, access_secret_key)

    const user = await User.findByPk(decode_Token.id)
    if (!user) {
        return res.status(400).json({ error: "Invalid access token" })
    }

    // Call AI tool API to generate images
    const response = await axios.post('https://cloud.leonardo.ai/api/rest/v1/generations', { number_of_images: 4 });
    const images = response.data.images;

    // Apply overlay text
    const overlayTextResponse = await axios.get('YOUR_TEXT_ENDPOINT');
    const overlayText = overlayTextResponse.data.text;

    // Apply overlays and save images
    for (let i = 0; i < images.length; i++) {
      const imageUrl = images[i];
      const overlayUrl = i % 2 === 0 ?
        'https://www.cascadia.edu/discover/news/images_news/NOW%20HIRING-PTH-Web.png' :
        'https://i.guim.co.uk/img/static/sys-images/Guardian/Pix/pictures/2014/9/6/1409996214228/A-revamped-Post-Office-br-011.jpg?width=1200&height=630&quality=85&auto=format&fit=crop&overlay-align=bottom%2Cleft&overlay-width=100p&overlay-base64=L2ltZy9zdGF0aWMvb3ZlcmxheXMvdG8tYWdlLTIwMTQucG5n&enable=upscale&s=dde3239fcce1bb6bba4f3024b5e0e8c7';

      // Fetch overlay image
      const overlayResponse = await axios.get(overlayUrl, { responseType: 'arraybuffer' });
      const overlayImage = Buffer.from(overlayResponse.data, 'binary');

      // Fetch generated image
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const generatedImage = Buffer.from(imageResponse.data, 'binary');

      // Save the modified image
      fs.writeFileSync(`generated_image_${i+1}.png`, modifiedImageBuffer);
      
      // Save image to database
      await Image.create({ 
        UserId: user.id,
        url :imageUrl });
    }

    res.status(200).json({ message: 'Images generated and saved successfully' });g
  } catch (error) {
    console.error(error);
    return res.status(500).json({status : false, message: 'Internal Server Error' });
  }
};

//Controller for the storing the text in database
const setOverlayText = async (req, res) => {
  try {
    const { text } = req.body;
    await OverlayText.create({ text });
   return res.status(200).json({status : true, message: 'Overlay text set successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({status : false, message: 'Internal Server Error' });

  }
};

module.exports = {
   register, 
   login,
   generateImages, 
   setOverlayText 
  };
