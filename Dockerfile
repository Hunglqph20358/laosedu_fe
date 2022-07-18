# FROM node:latest as node
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build --prod

# ENV PORT=8080

FROM nginx:alpine
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=node /app/dist/ /usr/share/nginx/html/
COPY ./dist /usr/share/nginx/html/
# RUN chmod 777 -R /usr/share/nginx/html
COPY nginx.conf /etc/nginx/
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]