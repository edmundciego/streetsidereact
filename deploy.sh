git pull
yarn build
pm2 delete "6ammart-web-next-js-dev"
pm2 start yarn --name "6ammart-web-next-js-dev" -- start
