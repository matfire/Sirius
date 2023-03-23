FROM node:lts
WORKDIR /app
COPY . .
RUN npm install --loglevel=error
RUN npm run db:generate
RUN npm run build
CMD ["npm", "start"]
