FROM node:18

# Create app directory
WORKDIR /usr/src/app

COPY . .

# Install app dependencies
RUN yarn

# Generate Prisma client
RUN yarn prisma generate

# Creates a "dist" folder with the production build
RUN yarn build

# Start the server using the production build
CMD [ "yarn", "start:migrate:prod" ]
