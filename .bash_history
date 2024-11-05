sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y git
ls
cd /var
ls
cd ..
ls
cd .
cd ..
ls
cd ~
ls
mkdir image-upload-app
cd image-upload-app
npm init -y
npm install aws-sdk
npm install express
npm install dotenv
npm install body-parser
mkdir config
nano config/dynamoConfig.js
ls
mkdir controllers
nano controllers/imageController.js
nano app.js
node app.js
nano controllers/imageController.js 
nano app.js 
node app.js
nano controllers/imageController.js 
nano app.js
node app.js
npm install passport passport-google-oauth20 express-session
ls
cd image-upload-app/
ls
nano app.js 
;s
ls
cd config/
;s
ls
cd ..
nano config/passport.js
ls
mkdir routes
ls
nano routes/auth.js
nano app.js 
rm app.js 
nano app.js
ls
nano routes/auth.js
nano routes/upload.js
mkdir models
nano models/dynamoDB.js
rm config/passport.js
nano config/passport.js
rm models/dynamoDB.js
nano models/dynamoDB.js
rm config/passport.js
nano config/passport.js
ls
cd routes/
ls
cd ..
rm models/dynamoDB.js
nano models/dynamoDB.js
mkdir middleware
nano middleware/auth.js
ls
cd ..
ls
cd image-upload-app/
node app.js 
sudo amazon-linux-extras install nginx1 -y
sudo systemctl start nginx
sudo systemctl enable nginx
sudo nano /etc/nginx/nginx.conf
sudo nginx -t
sudo systemctl reload nginx
sudo amazon-linux-extras install epel
sudo certbot --nginx -d motif-official.com -d www.motif-official.com
sudo amazon-linux-extras install epel -y
sudo yum install certbot python3-certbot-nginx -y
sudo certbot --nginx -d motif-official.com -d www.motif-official.com
sudo certbot renew --dry-run
node app.js 
nano app.js 
node app.js 
nano models/dynamoDB.js 
nano app.js 
nano models/dynamoDB.js 
node app.js 
