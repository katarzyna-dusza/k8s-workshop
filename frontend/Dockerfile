FROM nginx

COPY ./build /etc/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
WORKDIR /etc/nginx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
